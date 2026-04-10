import PermissionService from "@application/features/system/services/PermissionService";
import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import Directory from "@domain/models/Directory";
import File from "@domain/models/File";
import PathUtils from "@packages/acore-ts/data/path/PathUtils";
import { logger } from "@shared/utils/logger";
import { PERFORMANCE_LIMITS } from "../constants";
import { DirectoryTooDeepError, OperationTimeoutError } from "../errors";

/**
 * Iterative directory operations to prevent stack overflow
 * Uses breadth-first approach for better memory management
 */

export interface DirectoryTraversalOptions {
  maxDepth?: number;
  includeFiles?: boolean;
  includeDirectories?: boolean;
  onProgress?: (processed: number, total: number) => void;
  timeoutMs?: number;
}

export interface TraversalResult {
  entries: FileSystemEntry[];
  totalProcessed: number;
  maxDepthReached: number;
  directoriesFound: number;
  filesFound: number;
}

/**
 * Iterative directory traversal using BFS to prevent stack overflow
 */
export class DirectoryOperations {
  constructor(private readonly fileSystemService: IFileSystemService) {}

  /**
   * Iteratively traverse directory structure
   */
  async traverseDirectory(startPath: string, options: DirectoryTraversalOptions = {}): Promise<TraversalResult> {
    const {
      maxDepth = PERFORMANCE_LIMITS.MAX_RECURSION_DEPTH,
      includeFiles = true,
      includeDirectories = true,
      onProgress,
      timeoutMs = PERFORMANCE_LIMITS.OPERATION_TIMEOUT_MS,
    } = options;

    const startTime = Date.now();
    const timeoutTime = startTime + timeoutMs;

    // Validate start path
    if (!(await this.pathExists(startPath))) {
      throw new Error(`Directory not found: ${startPath}`);
    }

    const result: TraversalResult = {
      entries: [],
      totalProcessed: 0,
      maxDepthReached: 0,
      directoriesFound: 0,
      filesFound: 0,
    };

    // Use queue for BFS traversal
    const queue: Array<{ path: string; depth: number }> = [{ path: startPath, depth: 0 }];

    const visited = new Set<string>();

    while (queue.length > 0) {
      // Check timeout
      if (Date.now() > timeoutTime) {
        throw new OperationTimeoutError("directory traversal", timeoutMs);
      }

      const { path, depth } = queue.shift()!;

      // Skip if already visited
      if (visited.has(path)) {
        continue;
      }
      visited.add(path);

      // Check depth limit
      if (depth > maxDepth) {
        throw new DirectoryTooDeepError(path, depth, maxDepth);
      }

      result.maxDepthReached = Math.max(result.maxDepthReached, depth);

      try {
        // Get immediate children of current directory
        const children = await this.getImmediateChildren(path);

        for (const child of children) {
          result.totalProcessed++;

          // Add to results based on options
          if (child instanceof Directory && includeDirectories) {
            result.entries.push(child);
            result.directoriesFound++;
          } else if (child instanceof File && includeFiles) {
            result.entries.push(child);
            result.filesFound++;
          }

          // Add directories to queue for further traversal
          if (child instanceof Directory && depth < maxDepth) {
            queue.push({ path: child.fullPath, depth: depth + 1 });
          }

          // Report progress
          if (onProgress && result.totalProcessed % 100 === 0) {
            onProgress(result.totalProcessed, result.totalProcessed);
          }
        }
      } catch (error) {
        logger.warn(`Error accessing directory ${path}:`, error);
        // Continue with other directories
      }
    }

    // Final progress report
    if (onProgress) {
      onProgress(result.totalProcessed, result.totalProcessed);
    }

    logger.debug(
      `Directory traversal completed: ${result.totalProcessed} entries, max depth: ${result.maxDepthReached}`,
    );

    return result;
  }

  /**
   * Iteratively copy directory contents with enhanced security and validation
   */
  async copyDirectoryContents(
    sourceDirPath: string,
    destDirPath: string,
    options: DirectoryTraversalOptions = {},
  ): Promise<void> {
    const {
      maxDepth = PERFORMANCE_LIMITS.MAX_RECURSION_DEPTH,
      onProgress,
      timeoutMs = PERFORMANCE_LIMITS.OPERATION_TIMEOUT_MS,
    } = options;

    const startTime = Date.now();
    const timeoutTime = startTime + timeoutMs;

    // Validate paths and permissions
    PermissionService.validatePath(sourceDirPath);
    PermissionService.validatePath(destDirPath);

    // Validate source directory exists
    const sourceExists = await this.pathExists(sourceDirPath);
    if (!sourceExists) {
      throw new Error(`Source directory not found: ${sourceDirPath}`);
    }

    // Prevent copying directory into itself
    if (destDirPath.startsWith(`${sourceDirPath}/`) || destDirPath === sourceDirPath) {
      throw new Error(`Cannot copy directory into itself or its subdirectory: ${sourceDirPath} -> ${destDirPath}`);
    }

    // Use queue for iterative copy
    const queue: Array<{ sourcePath: string; destPath: string; depth: number }> = [
      { sourcePath: sourceDirPath, destPath: destDirPath, depth: 0 },
    ];

    let processedCount = 0;
    let totalCount = 0;

    // First, count total items for progress reporting
    try {
      const traversal = await this.traverseDirectory(sourceDirPath, { maxDepth, timeoutMs: timeoutMs / 2 });
      totalCount = traversal.totalProcessed;
    } catch (error) {
      // If counting fails, continue without progress tracking
      logger.warn("Could not count total items for progress:", error);
    }

    while (queue.length > 0) {
      // Check timeout
      if (Date.now() > timeoutTime) {
        throw new OperationTimeoutError("directory copy", timeoutMs);
      }

      const { sourcePath, destPath, depth } = queue.shift()!;

      // Check depth limit
      if (depth > maxDepth) {
        throw new DirectoryTooDeepError(sourcePath, depth, maxDepth);
      }

      try {
        // Get children of current directory
        const children = await this.getImmediateChildren(sourcePath);

        // Create destination directory if it doesn't exist
        if (depth === 0) {
          await this.ensureDirectoryExists(destDirPath);
        }

        for (const child of children) {
          const childDestPath = PathUtils.normalize(destPath, child.name);

          if (child instanceof File) {
            // Copy file
            const newFile = new File(childDestPath, child.content, child.createdDate, child.size, new Date());
            await this.fileSystemService.add(newFile);
            processedCount++;
          } else if (child instanceof Directory && depth < maxDepth) {
            // Create directory and add to queue
            const newDirectory = new Directory(childDestPath, child.createdDate, new Date());
            await this.fileSystemService.add(newDirectory);

            queue.push({
              sourcePath: child.fullPath,
              destPath: childDestPath,
              depth: depth + 1,
            });
          }

          // Report progress
          if (onProgress && processedCount % 10 === 0) {
            onProgress(processedCount, totalCount);
          }
        }
      } catch (error) {
        logger.error(`Error copying directory contents from ${sourcePath} to ${destPath}:`, error);
        throw error;
      }
    }

    // Final progress report
    if (onProgress) {
      onProgress(processedCount, totalCount);
    }

    logger.debug(`Directory copy completed: ${processedCount} items copied from ${sourceDirPath} to ${destDirPath}`);
  }

  /**
   * Iteratively delete directory contents with enhanced security validation
   */
  async deleteDirectoryContents(dirPath: string, options: DirectoryTraversalOptions = {}): Promise<void> {
    const { maxDepth = PERFORMANCE_LIMITS.MAX_RECURSION_DEPTH, timeoutMs = PERFORMANCE_LIMITS.OPERATION_TIMEOUT_MS } =
      options;

    const startTime = Date.now();
    const timeoutTime = startTime + timeoutMs;

    // Validate path and permissions before deletion
    PermissionService.validatePath(dirPath);

    // Additional safety check: prevent deletion of root directory
    if (dirPath === "/" || dirPath.trim() === "/") {
      throw new Error("Cannot delete root directory for safety reasons");
    }

    // Collect all paths to delete (post-order traversal)
    const pathsToDelete: Array<{ path: string; type: "file" | "directory" }> = [];

    // First, traverse and collect all paths
    const queue: Array<{ path: string; depth: number }> = [{ path: dirPath, depth: 0 }];

    while (queue.length > 0) {
      // Check timeout
      if (Date.now() > timeoutTime) {
        throw new OperationTimeoutError("directory deletion", timeoutMs);
      }

      const { path, depth } = queue.shift()!;

      // Check depth limit
      if (depth > maxDepth) {
        throw new DirectoryTooDeepError(path, depth, maxDepth);
      }

      try {
        const children = await this.getImmediateChildren(path);

        for (const child of children) {
          if (child instanceof File) {
            pathsToDelete.push({ path: child.fullPath, type: "file" });
          } else if (child instanceof Directory && depth < maxDepth) {
            pathsToDelete.push({ path: child.fullPath, type: "directory" });
            queue.push({ path: child.fullPath, depth: depth + 1 });
          }
        }
      } catch (error) {
        logger.warn(`Error accessing directory ${path} during deletion:`, error);
      }
    }

    // Finally, delete the directory itself
    pathsToDelete.push({ path: dirPath, type: "directory" });

    // Delete all collected paths (reverse order: files first, then directories)
    // Process in batches for better performance
    const batchSize = 50;
    const reversedPaths = pathsToDelete.reverse();

    for (let i = 0; i < reversedPaths.length; i += batchSize) {
      // Check timeout
      if (Date.now() > timeoutTime) {
        throw new OperationTimeoutError("directory deletion", timeoutMs);
      }

      const batch = reversedPaths.slice(i, i + batchSize);

      // Delete batch in parallel for better performance
      await Promise.allSettled(
        batch.map(async ({ path, type }) => {
          try {
            await this.fileSystemService.remove((entry) => entry.fullPath === path);
          } catch (error) {
            logger.error(`Error deleting ${type} ${path}:`, error);
            // Continue with other deletions
          }
        }),
      );
    }

    logger.debug(`Directory deletion completed: ${pathsToDelete.length} items deleted from ${dirPath}`);
  }

  /**
   * Check if directory is empty
   */
  async isDirectoryEmpty(dirPath: string): Promise<boolean> {
    try {
      const children = await this.getImmediateChildren(dirPath);
      return children.length === 0;
    } catch (error) {
      logger.debug(`isDirectoryEmpty: Error checking ${dirPath}`, error);
      return false;
    }
  }

  /**
   * Get directory size recursively (iterative)
   */
  async getDirectorySize(dirPath: string, options: DirectoryTraversalOptions = {}): Promise<number> {
    let totalSize = 0;

    const traversal = await this.traverseDirectory(dirPath, {
      ...options,
      includeDirectories: false,
      includeFiles: true,
    });

    for (const entry of traversal.entries) {
      if (entry instanceof File) {
        totalSize += entry.size;
      }
    }

    return totalSize;
  }

  /**
   * Get immediate children of a directory (non-recursive)
   */
  private async getImmediateChildren(dirPath: string): Promise<FileSystemEntry[]> {
    const normalizedPath = PathUtils.normalize("/", dirPath);

    const entries = await this.fileSystemService.getAll((entry) => {
      if (normalizedPath === "/") {
        // Root directory - show immediate children
        const parts = entry.fullPath.split("/").filter(Boolean);
        return parts.length === 1;
      }

      // Other directories - show immediate children
      const entryParts = entry.fullPath.split("/").filter(Boolean);
      const pathParts = normalizedPath.split("/").filter(Boolean);

      return entry.fullPath.startsWith(normalizedPath) && entryParts.length === pathParts.length + 1;
    });

    return entries;
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
   * Ensure directory exists
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    const exists = await this.pathExists(dirPath);
    if (!exists) {
      const newDirectory = new Directory(dirPath, new Date());
      await this.fileSystemService.add(newDirectory);
    }
  }
}
