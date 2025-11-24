import PermissionService from "@application/features/system/services/PermissionService";
import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import Directory from "@domain/models/Directory";
import File from "@domain/models/File";
import { logger } from "@shared/utils/logger";
import { PERFORMANCE_LIMITS } from "../constants";
import { FileNotFoundError, OperationFailedError } from "../errors";
import { DirectoryOperations } from "../utils/DirectoryOperations";
import { PathSanitizer } from "../utils/InputSanitizer";
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
      PathSanitizer.validatePath(parentPath);
      const sanitizedName = PathSanitizer.sanitizeFileName(name);

      PermissionService.validatePath(parentPath);

      // Generate unique name if directory already exists
      const actualName = await this.generateUniqueName(parentPath, sanitizedName, true);
      const fullPath = PathSanitizer.joinPath(parentPath, actualName);
      PermissionService.validatePath(fullPath);

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
      PathSanitizer.validatePath(parentPath);
      const sanitizedName = PathSanitizer.sanitizeFileName(name);

      PermissionService.validatePath(parentPath);

      // Generate unique name if file already exists
      const actualName = await this.generateUniqueName(parentPath, sanitizedName, false);
      const fullPath = PathSanitizer.joinPath(parentPath, actualName);
      PermissionService.validatePath(fullPath);

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

    PathSanitizer.validatePath(destinationPath);
    PermissionService.validatePath(destinationPath);

    const allPaths = [...sourcePaths, destinationPath];

    return new Promise((resolve, reject) => {
      globalOperationQueue.add({
        type: OperationType.COPY,
        priority: 5, // Medium priority for copy operations
        paths: allPaths,
        execute: () => this.executeCopy(sourcePaths, destinationPath),
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

    PathSanitizer.validatePath(destinationPath);
    PermissionService.validatePath(destinationPath);

    const allPaths = [...sourcePaths, destinationPath];

    return new Promise((resolve, reject) => {
      globalOperationQueue.add({
        type: OperationType.MOVE,
        priority: 7, // High-medium priority for move operations
        paths: allPaths,
        execute: () => this.executeMove(sourcePaths, destinationPath),
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
   * Execute rename operation
   */
  private async executeRename(oldPath: string, newName: string): Promise<void> {
    logger.debug(`Renaming: ${oldPath} -> ${newName}`);

    // Validate inputs
    PathSanitizer.validatePath(oldPath);
    const sanitizedName = PathSanitizer.sanitizeFileName(newName);

    // Get source entry
    const sourceEntry = await this.fileSystemService.get((e) => e.fullPath === oldPath);
    if (!sourceEntry) {
      throw new FileNotFoundError(oldPath);
    }

    const parentPath = PathSanitizer.getDirectoryPath(oldPath);
    PermissionService.validatePath(parentPath);

    // Check if new name already exists
    const newPath = PathSanitizer.joinPath(parentPath, sanitizedName);
    if ((await this.pathExists(newPath)) && newPath !== oldPath) {
      // Generate unique name if needed
      const uniqueName = await this.generateUniqueName(parentPath, newName, sourceEntry instanceof Directory);
      const finalPath = PathSanitizer.joinPath(parentPath, uniqueName);
      await this.moveEntry(sourceEntry, finalPath);
    } else {
      await this.moveEntry(sourceEntry, newPath);
    }

    logger.debug(`Renamed: ${oldPath} -> ${newPath}`);
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
   * Move an entry to a new path
   */
  private async moveEntry(sourceEntry: FileSystemEntry, newPath: string): Promise<void> {
    PermissionService.validatePath(newPath);

    try {
      // Remove the old entry
      await this.fileSystemService.remove((e) => e.fullPath === sourceEntry.fullPath);

      // Add the new entry
      if (sourceEntry instanceof File) {
        const updatedFile = new File(
          newPath,
          sourceEntry.content,
          sourceEntry.createdDate,
          sourceEntry.size,
          new Date(),
        );
        await this.fileSystemService.add(updatedFile);
      } else {
        const updatedDirectory = new Directory(newPath, sourceEntry.createdDate, new Date());
        await this.fileSystemService.add(updatedDirectory);
      }
    } catch (error) {
      // If move fails, try to restore the original entry
      logger.error("Move failed, attempting to restore original entry:", error);
      try {
        await this.fileSystemService.add(sourceEntry);
      } catch (restoreError) {
        logger.error("Failed to restore original entry:", restoreError);
      }
      throw new OperationFailedError("move", sourceEntry.fullPath, error as Error);
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
