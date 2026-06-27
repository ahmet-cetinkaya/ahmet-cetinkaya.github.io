import PermissionService from "@application/features/system/services/PermissionService";
import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import { pathExists as checkPathExists } from "@application/shared/pathExists";
import Directory from "@domain/models/Directory";
import File from "@domain/models/File";
import { logger } from "@shared/utils/logger";
import { PERFORMANCE_LIMITS } from "../constants";
import { FileNotFoundError, InvalidFilenameError, OperationFailedError } from "../errors";
import { DirectoryOperations } from "../utils/DirectoryOperations";
import { PathSanitizer, StringSanitizer, ValidationHelper } from "../utils/InputSanitizer";
import { globalOperationQueue, OperationType } from "../utils/OperationQueue";

// Maximum suffix generation attempts to prevent infinite loops
const MAX_GENERATION_SUFFIX = 999;

/**
 * Handles file system operations (create, copy, move, delete, rename)
 * Separated from navigation and UI concerns for better maintainability
 */
export default class FileOperationsService {
  private readonly directoryOperations: DirectoryOperations;

  constructor(private readonly fileSystemService: IFileSystemService) {
    this.directoryOperations = new DirectoryOperations(fileSystemService);
  }

  private async prepareCreateOperation(parentPath: string, name: string, isDirectory: boolean) {
    const { validatedParentPath, sanitizedName } = ValidationHelper.validateFileOperation(parentPath, name, "create");
    const actualName = await this.generateUniqueName(validatedParentPath, sanitizedName, isDirectory);
    const fullPath = PathSanitizer.joinPath(validatedParentPath, actualName);
    ValidationHelper.validatePathWithPermissions(fullPath);
    return { validatedParentPath, actualName, fullPath };
  }

  private wrapCreateError(operation: string, parentPath: string, name: string, error: unknown): never {
    if (error instanceof Error) {
      logger.error(`Failed to ${operation} ${name} in ${parentPath}:`, error);
      throw error;
    }
    throw new OperationFailedError(operation, parentPath, new Error(String(error)));
  }

  /**
   * Create a new directory
   */
  async createDirectory(parentPath: string, name: string): Promise<{ directory: Directory; actualName: string }> {
    try {
      const { actualName, fullPath } = await this.prepareCreateOperation(parentPath, name, true);
      const newDirectory = new Directory(fullPath, new Date());
      await this.fileSystemService.add(newDirectory);
      logger.info(`Created directory: ${fullPath}`);
      return { directory: newDirectory, actualName };
    } catch (error) {
      this.wrapCreateError("create directory", parentPath, name, error);
    }
  }

  /**
   * Create a new file
   */
  async createFile(
    parentPath: string,
    name: string,
    content: string = "",
  ): Promise<{ file: File; actualName: string }> {
    try {
      const { actualName, fullPath } = await this.prepareCreateOperation(parentPath, name, false);
      const sanitizedContent = StringSanitizer.forFileContent(content);
      const contentBytes = new TextEncoder().encode(sanitizedContent).length;
      const newFile = new File(fullPath, sanitizedContent, new Date(), contentBytes, new Date());
      await this.fileSystemService.add(newFile);
      logger.info(`Created file: ${fullPath} (${contentBytes} bytes)`);
      return { file: newFile, actualName };
    } catch (error) {
      this.wrapCreateError("create file", parentPath, name, error);
    }
  }

  /**
   * Delete files and directories
   */
  async deleteEntries(paths: string[]): Promise<void> {
    if (paths.length === 0) {
      throw new InvalidFilenameError("", "Cannot delete empty path array");
    }

    return new Promise((resolve, reject) => {
      globalOperationQueue.add({
        type: OperationType.DELETE,
        priority: 10, // High priority for delete operations
        paths,
        execute: () => this.executeDelete(paths),
        onComplete: () => resolve(),
        onError: reject,
      });
    });
  }

  /**
   * Copy files and directories
   */
  async copyEntries(sourcePaths: string[], destinationPath: string): Promise<void> {
    return this.queueTransferEntries(sourcePaths, destinationPath, OperationType.COPY, 5, (sources, dest) =>
      this.executeCopy(sources, dest),
    );
  }

  /**
   * Move files and directories
   */
  async moveEntries(sourcePaths: string[], destinationPath: string): Promise<void> {
    return this.queueTransferEntries(sourcePaths, destinationPath, OperationType.MOVE, 7, (sources, dest) =>
      this.executeMove(sources, dest),
    );
  }

  private async queueTransferEntries(
    sourcePaths: string[],
    destinationPath: string,
    type: OperationType,
    priority: number,
    execute: (sources: string[], dest: string) => Promise<void>,
  ): Promise<void> {
    if (sourcePaths.length === 0) return;

    const { validatedSources, validatedDestination } = ValidationHelper.validateOperationPaths(
      sourcePaths,
      destinationPath,
    );

    return new Promise((resolve, reject) => {
      globalOperationQueue.add({
        type,
        priority,
        paths: [...validatedSources, validatedDestination],
        execute: () => execute(validatedSources, validatedDestination),
        onComplete: () => resolve(),
        onError: reject,
      });
    });
  }

  /**
   * Rename a file or directory
   */
  async renameEntry(oldPath: string, newName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      globalOperationQueue.add({
        type: OperationType.RENAME,
        priority: 8, // High priority for rename operations
        paths: [oldPath],
        execute: () => this.executeRename(oldPath, newName),
        onComplete: () => resolve(),
        onError: reject,
      });
    });
  }

  /**
   * Execute delete operation
   */
  private async executeDelete(paths: string[]): Promise<void> {
    logger.debug(`Deleting ${paths.length} items`);

    const failedPaths: Array<{ path: string; error: Error }> = [];
    const notFoundPaths: string[] = [];

    for (const path of paths) {
      PathSanitizer.validatePath(path);
      PermissionService.validatePath(path);

      if (!(await this.pathExists(path))) {
        logger.warn(`Path not found for deletion: ${path}`);
        notFoundPaths.push(path);
        continue;
      }

      try {
        const entry = await this.fileSystemService.get((e) => e.fullPath === path);
        if (!entry) continue;

        if (entry instanceof Directory) {
          await this.directoryOperations.deleteDirectoryContents(path);
        } else {
          await this.fileSystemService.remove((e) => e.fullPath === path);
        }

        logger.debug(`Deleted: ${path}`);
      } catch (error) {
        logger.error(`Failed to delete ${path}:`, error);
        failedPaths.push({ path, error: error instanceof Error ? error : new Error(String(error)) });
      }
    }

    const totalFailed = failedPaths.length + notFoundPaths.length;
    if (totalFailed > 0) {
      const errorParts: string[] = [];
      if (notFoundPaths.length > 0) {
        errorParts.push(`Not found: ${notFoundPaths.join(", ")}`);
      }
      if (failedPaths.length > 0) {
        errorParts.push(`Failed: ${failedPaths.map((f) => `${f.path}: ${f.error.message}`).join("; ")}`);
      }
      const errorMessage = errorParts.join("; ");
      const firstPath = failedPaths[0]?.path || notFoundPaths[0] || "";
      const firstError = failedPaths[0]?.error;
      throw new OperationFailedError(errorMessage, firstPath, firstError);
    }
  }

  /**
   * Execute copy operation
   */
  private async executeCopy(sourcePaths: string[], destinationPath: string): Promise<void> {
    logger.debug(`Copying ${sourcePaths.length} items to ${destinationPath}`);

    for (const sourcePath of sourcePaths) {
      // Validate source path
      PathSanitizer.validatePath(sourcePath);
      PermissionService.validatePath(sourcePath);

      // Get source entry
      const sourceEntry = await this.fileSystemService.get((e) => e.fullPath === sourcePath);
      if (!sourceEntry) {
        throw new FileNotFoundError(sourcePath);
      }

      // Generate unique destination name
      const uniqueName = await this.generateUniqueName(
        destinationPath,
        sourceEntry.name,
        sourceEntry instanceof Directory,
      );
      const destPath = PathSanitizer.joinPath(destinationPath, uniqueName);

      // Copy the entry
      if (sourceEntry instanceof File) {
        await this.copyFile(sourceEntry, destPath);
      } else {
        await this.copyDirectory(sourceEntry, destPath);
      }

      logger.debug(`Copied: ${sourcePath} -> ${destPath}`);
    }
  }

  /**
   * Execute move operation (copy + delete)
   */
  private async executeMove(sourcePaths: string[], destinationPath: string): Promise<void> {
    // First copy all items
    await this.executeCopy(sourcePaths, destinationPath);

    // Then delete source items
    await this.executeDelete(sourcePaths);

    logger.debug(`Moved ${sourcePaths.length} items to ${destinationPath}`);
  }

  /**
   * Execute rename operation with improved collision detection and transaction safety
   */
  private async executeRename(oldPath: string, newName: string): Promise<void> {
    logger.debug(`Renaming: ${oldPath} -> ${newName}`);

    // Validate inputs
    PathSanitizer.validatePath(oldPath);
    const sanitizedName = PathSanitizer.sanitizeFileName(newName);

    // Disallow empty names after sanitization
    if (!sanitizedName.trim()) {
      throw new OperationFailedError("rename", oldPath, new Error("Invalid name: name cannot be empty"));
    }

    // Get source entry
    const sourceEntry = await this.fileSystemService.get((e) => e.fullPath === oldPath);
    if (!sourceEntry) {
      throw new FileNotFoundError(oldPath);
    }

    const parentPath = PathSanitizer.getDirectoryPath(oldPath);
    PermissionService.validatePath(parentPath);

    // Calculate the target path with the sanitized name
    const candidatePath = PathSanitizer.joinPath(parentPath, sanitizedName);

    // Determine final path with collision detection
    let finalPath = candidatePath;

    // Check for collision with existing entries (excluding the source itself)
    if (candidatePath !== oldPath && (await this.pathExists(candidatePath))) {
      logger.warn(`Name collision detected: ${candidatePath} already exists`);
      const uniqueName = await this.generateUniqueName(parentPath, sanitizedName, sourceEntry instanceof Directory);
      finalPath = PathSanitizer.joinPath(parentPath, uniqueName);
      logger.debug(`Using unique name: ${finalPath}`);
    }

    // Additional validation: ensure we're not trying to rename a parent directory to a subdirectory of itself
    if (sourceEntry instanceof Directory && finalPath.startsWith(`${oldPath}/`)) {
      throw new OperationFailedError("rename", oldPath, new Error("Cannot move a directory into its own subdirectory"));
    }

    // Perform the atomic move operation with rollback safety
    await this.moveEntry(sourceEntry, finalPath);

    logger.debug(`Successfully renamed: ${oldPath} -> ${finalPath}`);
  }

  /**
   * Copy a single file
   */
  private async copyFile(sourceFile: File, destPath: string): Promise<void> {
    PermissionService.validatePath(destPath);

    const content = await this.fileSystemService.readFileContent(sourceFile.fullPath);
    const newFile = new File(destPath, content, sourceFile.createdDate, sourceFile.size, new Date());

    await this.fileSystemService.add(newFile);
  }

  /**
   * Copy a directory with all its contents
   */
  private async copyDirectory(sourceDirectory: Directory, destPath: string): Promise<void> {
    PermissionService.validatePath(destPath);

    // Create destination directory
    const newDirectory = new Directory(destPath, sourceDirectory.createdDate, new Date());
    await this.fileSystemService.add(newDirectory);

    // Copy directory contents iteratively
    await this.directoryOperations.copyDirectoryContents(sourceDirectory.fullPath, destPath, {
      timeoutMs: PERFORMANCE_LIMITS.OPERATION_TIMEOUT_MS,
      maxDepth: PERFORMANCE_LIMITS.MAX_RECURSION_DEPTH,
    });
  }

  /**
   * Move an entry to a new path with improved transaction safety
   */
  private async moveEntry(sourceEntry: FileSystemEntry, newPath: string): Promise<void> {
    PermissionService.validatePath(newPath);

    // Validate that the source and target paths are different
    if (sourceEntry.fullPath === newPath) {
      logger.debug(`Source and target paths are identical, skipping move: ${newPath}`);
      return;
    }

    // For directories, we need to handle this as a recursive operation
    if (sourceEntry instanceof Directory) {
      await this.moveDirectory(sourceEntry, newPath);
    } else {
      await this.moveFile(sourceEntry, newPath);
    }
  }

  private async cleanupAndThrow(
    error: unknown,
    sourcePath: string,
    newPath: string,
    operation: string,
    cleanupFn: () => Promise<void>,
  ): Promise<never> {
    try {
      await cleanupFn();
    } catch (cleanupError) {
      logger.warn(`Failed to clean up ${newPath} during ${operation} rollback`, cleanupError);
    }
    const convertedError = error instanceof Error ? error : new Error(String(error));
    throw new OperationFailedError(operation, sourcePath, convertedError);
  }

  /**
   * Move a file with transaction safety
   */
  private async moveFile(sourceFile: File, newPath: string): Promise<void> {
    try {
      const updatedFile = new File(newPath, sourceFile.content, sourceFile.createdDate, sourceFile.size, new Date());
      await this.fileSystemService.add(updatedFile);
      await this.fileSystemService.remove((e) => e.fullPath === sourceFile.fullPath);
      logger.debug(`Successfully moved file: ${sourceFile.fullPath} -> ${newPath}`);
    } catch (error) {
      await this.cleanupAndThrow(error, sourceFile.fullPath, newPath, "move file", () =>
        this.fileSystemService.remove((e) => e.fullPath === newPath),
      );
    }
  }

  /**
   * Move a directory with all its contents recursively
   */
  private async moveDirectory(sourceDirectory: Directory, newPath: string): Promise<void> {
    try {
      await this.copyDirectory(sourceDirectory, newPath);
      await this.directoryOperations.deleteDirectoryContents(sourceDirectory.fullPath);
      await this.fileSystemService.remove((e) => e.fullPath === sourceDirectory.fullPath);
      logger.debug(`Successfully moved directory: ${sourceDirectory.fullPath} -> ${newPath}`);
    } catch (error) {
      await this.cleanupAndThrow(error, sourceDirectory.fullPath, newPath, "move directory", async () => {
        await this.directoryOperations.deleteDirectoryContents(newPath);
        await this.fileSystemService.remove((e) => e.fullPath === newPath);
      });
    }
  }

  /**
   * Generate a unique name by adding suffix if name already exists
   */
  private async generateUniqueName(parentPath: string, originalName: string, isDirectory: boolean): Promise<string> {
    const sanitizedName = PathSanitizer.sanitizeFileName(originalName);
    const originalPath = PathSanitizer.joinPath(parentPath, sanitizedName);

    if (!(await this.pathExists(originalPath))) {
      return sanitizedName;
    }

    // Extract name and extension for files
    let nameWithoutExt = sanitizedName;
    let extension = "";

    if (!isDirectory) {
      const lastDotIndex = sanitizedName.lastIndexOf(".");
      if (lastDotIndex > 0) {
        nameWithoutExt = sanitizedName.substring(0, lastDotIndex);
        extension = sanitizedName.substring(lastDotIndex);
      }
    }

    // Try suffixes (1), (2), (3), etc.
    let suffix = 1;
    let uniqueName: string;

    do {
      uniqueName = `${nameWithoutExt} (${suffix})${extension}`;
      const testPath = PathSanitizer.joinPath(parentPath, uniqueName);
      const exists = await this.pathExists(testPath);

      if (!exists) {
        return uniqueName;
      }

      suffix++;
    } while (suffix <= MAX_GENERATION_SUFFIX); // Prevent infinite loops

    // Fallback: use timestamp
    const timestamp = Date.now();
    return `${nameWithoutExt} (${timestamp})${extension}`;
  }

  /**
   * Check if path exists
   */
  private async pathExists(path: string): Promise<boolean> {
    return checkPathExists(this.fileSystemService, path);
  }
}
