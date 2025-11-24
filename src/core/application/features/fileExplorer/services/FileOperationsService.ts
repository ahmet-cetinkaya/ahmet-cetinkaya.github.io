import PermissionService from "@application/features/system/services/PermissionService";
import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import Directory from "@domain/models/Directory";
import File from "@domain/models/File";
import { logger } from "@shared/utils/logger";
import { PERFORMANCE_LIMITS } from "../constants";
import { FileNotFoundError, OperationFailedError } from "../errors";
import { DirectoryOperations } from "../utils/DirectoryOperations";
import { PathSanitizer, ValidationHelper } from "../utils/InputSanitizer";
import { globalOperationQueue, OperationType } from "../utils/OperationQueue";

/**
 * Handles file system operations (create, copy, move, delete, rename)
 * Separated from navigation and UI concerns for better maintainability
 */
export default class FileOperationsService {
  private readonly directoryOperations: DirectoryOperations;

  constructor(private readonly fileSystemService: IFileSystemService) {
    this.directoryOperations = new DirectoryOperations(fileSystemService);
  }

  /**
   * Create a new directory
   */
  async createDirectory(parentPath: string, name: string): Promise<{ directory: Directory; actualName: string }> {
    try {
      // Validate and prepare inputs using consolidated helper
      const { validatedParentPath, sanitizedName } = ValidationHelper.validateFileOperation(parentPath, name, "create");

      // Generate unique name if directory already exists
      const actualName = await this.generateUniqueName(validatedParentPath, sanitizedName, true);
      const fullPath = PathSanitizer.joinPath(validatedParentPath, actualName);

      // Validate the final path
      ValidationHelper.validatePathWithPermissions(fullPath);

      const newDirectory = new Directory(fullPath, new Date());
      await this.fileSystemService.add(newDirectory);

      logger.info(`Created directory: ${fullPath}`);
      return { directory: newDirectory, actualName };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to create directory ${name} in ${parentPath}:`, error);
        throw error;
      }
      throw new OperationFailedError("create directory", parentPath, error as Error);
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
      // Validate and prepare inputs using consolidated helper
      const { validatedParentPath, sanitizedName } = ValidationHelper.validateFileOperation(parentPath, name, "create");

      // Generate unique name if file already exists
      const actualName = await this.generateUniqueName(validatedParentPath, sanitizedName, false);
      const fullPath = PathSanitizer.joinPath(validatedParentPath, actualName);

      // Validate the final path
      ValidationHelper.validatePathWithPermissions(fullPath);

      const sanitizedContent = this.sanitizeFileContent(content);
      const contentBytes = new TextEncoder().encode(sanitizedContent).length;

      const newFile = new File(fullPath, sanitizedContent, new Date(), contentBytes, new Date());
      await this.fileSystemService.add(newFile);

      logger.info(`Created file: ${fullPath} (${contentBytes} bytes)`);
      return { file: newFile, actualName };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to create file ${name} in ${parentPath}:`, error);
        throw error;
      }
      throw new OperationFailedError("create file", parentPath, error as Error);
    }
  }

  /**
   * Delete files and directories
   */
  async deleteEntries(paths: string[]): Promise<void> {
    if (paths.length === 0) {
      return;
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
    if (sourcePaths.length === 0) {
      return;
    }

    // Validate all operation paths using consolidated helper
    const { validatedSources, validatedDestination } = ValidationHelper.validateOperationPaths(
      sourcePaths,
      destinationPath,
    );

    const allPaths = [...validatedSources, validatedDestination];

    return new Promise((resolve, reject) => {
      globalOperationQueue.add({
        type: OperationType.COPY,
        priority: 5, // Medium priority for copy operations
        paths: allPaths,
        execute: () => this.executeCopy(validatedSources, validatedDestination),
        onComplete: () => resolve(),
        onError: reject,
      });
    });
  }

  /**
   * Move files and directories
   */
  async moveEntries(sourcePaths: string[], destinationPath: string): Promise<void> {
    if (sourcePaths.length === 0) {
      return;
    }

    // Validate all operation paths using consolidated helper
    const { validatedSources, validatedDestination } = ValidationHelper.validateOperationPaths(
      sourcePaths,
      destinationPath,
    );

    const allPaths = [...validatedSources, validatedDestination];

    return new Promise((resolve, reject) => {
      globalOperationQueue.add({
        type: OperationType.MOVE,
        priority: 7, // High-medium priority for move operations
        paths: allPaths,
        execute: () => this.executeMove(validatedSources, validatedDestination),
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

    for (const path of paths) {
      // Validate path and permissions
      PathSanitizer.validatePath(path);
      PermissionService.validatePath(path);

      // Check if path exists
      if (!(await this.pathExists(path))) {
        logger.warn(`Path not found for deletion: ${path}`);
        continue;
      }

      try {
        const entry = await this.fileSystemService.get((e) => e.fullPath === path);
        if (!entry) continue;

        if (entry instanceof Directory) {
          // Delete directory recursively
          await this.directoryOperations.deleteDirectoryContents(path);
        } else {
          // Delete file directly
          await this.fileSystemService.remove((e) => e.fullPath === path);
        }

        logger.debug(`Deleted: ${path}`);
      } catch (error) {
        logger.error(`Failed to delete ${path}:`, error);
        throw new OperationFailedError("delete", path, error as Error);
      }
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

  /**
   * Move a file with transaction safety
   */
  private async moveFile(sourceFile: File, newPath: string): Promise<void> {
    const backupPath = `${sourceFile.fullPath}.backup.${Date.now()}`;
    let hasBackup = false;

    try {
      // Create a backup of the original file metadata
      const backupFile = new File(
        backupPath,
        sourceFile.content,
        sourceFile.createdDate,
        sourceFile.size,
        sourceFile.updatedDate,
      );

      // Step 1: Add backup (this won't interfere with the actual file system)
      await this.fileSystemService.add(backupFile);
      hasBackup = true;

      // Step 2: Create the new file
      const updatedFile = new File(newPath, sourceFile.content, sourceFile.createdDate, sourceFile.size, new Date());
      await this.fileSystemService.add(updatedFile);

      // Step 3: Remove the original file
      await this.fileSystemService.remove((e) => e.fullPath === sourceFile.fullPath);

      // Step 4: Clean up backup
      await this.fileSystemService.remove((e) => e.fullPath === backupPath);

      logger.debug(`Successfully moved file: ${sourceFile.fullPath} -> ${newPath}`);
    } catch (error) {
      // Rollback strategy
      logger.error(`File move failed, attempting rollback: ${sourceFile.fullPath} -> ${newPath}`, error);

      try {
        // If we created a new file, try to remove it
        await this.fileSystemService.remove((e) => e.fullPath === newPath);
      } catch (cleanupError) {
        logger.warn(`Failed to clean up target file during rollback: ${newPath}`, cleanupError);
      }

      try {
        // If we have a backup, remove it (the original file should still exist)
        if (hasBackup) {
          await this.fileSystemService.remove((e) => e.fullPath === backupPath);
        }
      } catch (backupCleanupError) {
        logger.warn(`Failed to clean up backup file during rollback: ${backupPath}`, backupCleanupError);
      }

      throw new OperationFailedError("move file", sourceFile.fullPath, error as Error);
    }
  }

  /**
   * Move a directory with all its contents recursively
   */
  private async moveDirectory(sourceDirectory: Directory, newPath: string): Promise<void> {
    try {
      // First copy the directory with all contents
      await this.copyDirectory(sourceDirectory, newPath);

      // If copy succeeds, delete the original directory
      await this.directoryOperations.deleteDirectoryContents(sourceDirectory.fullPath);

      // Finally remove the directory itself
      await this.fileSystemService.remove((e) => e.fullPath === sourceDirectory.fullPath);

      logger.debug(`Successfully moved directory: ${sourceDirectory.fullPath} -> ${newPath}`);
    } catch (error) {
      // Clean up partially copied directory if move failed
      logger.error(`Directory move failed, cleaning up: ${newPath}`, error);
      try {
        await this.directoryOperations.deleteDirectoryContents(newPath);
        await this.fileSystemService.remove((e) => e.fullPath === newPath);
      } catch (cleanupError) {
        logger.warn(`Failed to clean up partially copied directory: ${newPath}`, cleanupError);
      }

      throw new OperationFailedError("move directory", sourceDirectory.fullPath, error as Error);
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
    } while (suffix <= 999); // Prevent infinite loops

    // Fallback: use timestamp
    const timestamp = Date.now();
    return `${nameWithoutExt} (${timestamp})${extension}`;
  }

  /**
   * Check if path exists
   */
  private async pathExists(path: string): Promise<boolean> {
    if (path === "/") return true;

    const entry = await this.fileSystemService.get((e) => e.fullPath === path);
    return Boolean(entry);
  }

  /**
   * Sanitize file content to prevent issues
   */
  private sanitizeFileContent(content: string): string {
    // Remove null bytes and control characters except newlines and tabs
    /* eslint-disable-next-line no-control-regex */
    const controlChars = new RegExp("[\\x00-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]", "g");
    return content.replace(controlChars, "");
  }
}
