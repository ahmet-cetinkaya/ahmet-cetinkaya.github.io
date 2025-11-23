import PermissionService from "@application/features/system/services/PermissionService";
import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import Directory from "@domain/models/Directory";
import File from "@domain/models/File";
import PathUtils from "@packages/acore-ts/data/path/PathUtils";

// Simple logger for core application (avoid circular dependencies)
class CoreLogger {
  private isDevelopment = process.env.NODE_ENV !== "production";

  debug(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
}

const logger = new CoreLogger();

export enum FileViewMode {
  GRID = "grid",
  LIST = "list",
  TREE = "tree",
}

export enum FileSortCriteria {
  NAME = "name",
  SIZE = "size",
  MODIFIED = "modified",
  TYPE = "type",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export interface FileExplorerState {
  currentPath: string;
  selectedFiles: Set<string>;
  viewMode: FileViewMode;
  sortBy: FileSortCriteria;
  sortOrder: SortOrder;
  showHidden: boolean;
}

export interface FileOperations {
  copy: (source: string[], destination: string) => Promise<void>;
  move: (source: string[], destination: string) => Promise<void>;
  delete: (paths: string[]) => Promise<void>;
  createFolder: (path: string, name: string) => Promise<void>;
  rename: (path: string, newName: string) => Promise<void>;
}

export default class FileExplorerService {
  constructor(private readonly fileSystemService: IFileSystemService) {}

  async getDirectoryContents(path: string, options: Partial<FileExplorerState> = {}): Promise<FileSystemEntry[]> {
    const normalizedPath = PathUtils.normalize("/", path);

    let entries = await this.fileSystemService.getAll((entry) => {
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

    // Filter hidden files if not showing them
    if (!options.showHidden) {
      entries = entries.filter((entry) => !entry.name.startsWith("."));
    }

    return this.sortEntries(entries, options.sortBy, options.sortOrder);
  }

  async getDirectoryTree(path: string): Promise<Map<string, FileSystemEntry[]>> {
    const tree = new Map<string, FileSystemEntry[]>();

    const entries = await this.fileSystemService.getAll((entry) => {
      if (path === "/") {
        return entry.fullPath !== "/" && !entry.fullPath.includes("/", 1);
      }
      return entry.fullPath.startsWith(path) && entry.fullPath !== path;
    });

    // Group by directory
    for (const entry of entries) {
      if (entry instanceof File) {
        const dirPath = entry.directory || "/";
        if (!tree.has(dirPath)) {
          tree.set(dirPath, []);
        }
        tree.get(dirPath)!.push(entry);
      }
    }

    return tree;
  }

  private sortEntries(
    entries: FileSystemEntry[],
    sortBy: FileSortCriteria = FileSortCriteria.NAME,
    sortOrder: SortOrder = SortOrder.ASC,
  ): FileSystemEntry[] {
    const sorted = [...entries];

    sorted.sort((a, b) => {
      // Directories always come first
      if (a instanceof Directory && b instanceof File) return -1;
      if (a instanceof File && b instanceof Directory) return 1;

      let comparison = 0;

      switch (sortBy) {
        case FileSortCriteria.NAME:
          comparison = a.name.localeCompare(b.name);
          break;
        case FileSortCriteria.SIZE:
          if (a instanceof File && b instanceof File) {
            comparison = a.size - b.size;
          } else {
            comparison = a.name.localeCompare(b.name);
          }
          break;
        case FileSortCriteria.MODIFIED: {
          const aTime = a.updatedDate ?? a.createdDate;
          const bTime = b.updatedDate ?? b.createdDate;
          comparison = aTime.getTime() - bTime.getTime();
          break;
        }
        case FileSortCriteria.TYPE:
          if (a instanceof File && b instanceof File) {
            comparison = a.extension.localeCompare(b.extension);
          } else {
            comparison = a.name.localeCompare(b.name);
          }
          break;
      }

      return sortOrder === SortOrder.ASC ? comparison : -comparison;
    });

    return sorted;
  }

  async navigateToParent(currentPath: string): Promise<string | null> {
    if (currentPath === "/") return null;

    const parentPath = PathUtils.normalize("/", `${currentPath}/..`);
    const parentExists = await this.pathExists(parentPath);
    return parentExists ? parentPath : null;
  }

  async pathExists(path: string): Promise<boolean> {
    if (path === "/") return true;

    const entry = await this.fileSystemService.get((e) => e.fullPath === path);
    return Boolean(entry);
  }

  async getEntryType(path: string): Promise<"file" | "directory" | null> {
    const entry = await this.fileSystemService.get((e) => e.fullPath === path);
    if (!entry) return null;
    return entry instanceof Directory ? "directory" : "file";
  }

  // File operations methods
  async createFolder(parentPath: string, name: string): Promise<void> {
    // Validate that we can create folders in the parent path
    PermissionService.validatePath(parentPath);

    const uniqueName = await this.generateUniqueName(parentPath, name, true);
    const fullPath = PathUtils.normalize(parentPath, uniqueName);

    // Validate the full path of the new folder
    PermissionService.validatePath(fullPath);

    const newDirectory = new Directory(fullPath, new Date());
    await this.fileSystemService.add(newDirectory);
  }

  async createFile(parentPath: string, name: string): Promise<void> {
    // Validate that we can create files in the parent path
    PermissionService.validatePath(parentPath);

    const uniqueName = await this.generateUniqueName(parentPath, name, false);
    const fullPath = PathUtils.normalize(parentPath, uniqueName);

    // Validate the full path of the new file
    PermissionService.validatePath(fullPath);

    const newFile = new File(fullPath, "", new Date(), 0, new Date());
    await this.fileSystemService.add(newFile);
  }

  async deleteEntries(paths: string[]): Promise<void> {
    // Validate that we can delete all paths
    PermissionService.validatePaths(paths);

    for (const path of paths) {
      await this.fileSystemService.remove((entry) => entry.fullPath === path);
    }
  }

  async renameEntry(oldPath: string, newName: string): Promise<void> {
    logger.debug(`Attempting to rename: ${oldPath} to ${newName}`);
    const entry = await this.fileSystemService.get((e) => e.fullPath === oldPath);
    if (!entry) throw new Error(`Entry not found: ${oldPath}`);

    const parentPath = PathUtils.normalize(oldPath, "..");
    logger.debug(`Parent path: ${parentPath}`);

    // First check if the new name is available
    const directNewPath = parentPath === "/" ? `/${newName}` : `${parentPath}/${newName}`;

    logger.debug(`Direct new path: ${directNewPath}`);

    // Validate that we can modify the old path and parent path
    PermissionService.validatePath(oldPath);
    PermissionService.validatePath(parentPath);

    const exists = await this.pathExists(directNewPath);
    logger.debug(`New path exists: ${exists}`);

    // Only generate unique name if there's a conflict
    const finalName = exists ? await this.generateUniqueName(parentPath, newName, entry instanceof Directory) : newName;
    const newPath = parentPath === "/" ? `/${finalName}` : `${parentPath}/${finalName}`;

    // Validate the new path
    PermissionService.validatePath(newPath);

    logger.debug(`Final rename path: ${oldPath} -> ${newPath}`);

    // For rename, we need to update the original entry in place
    // to maintain the same id, then add the updated entry with new path
    try {
      // Remove the old entry first
      await this.fileSystemService.remove((e) => e.fullPath === oldPath);

      // Create and add the new entry with the updated path
      if (entry instanceof File) {
        logger.debug(`Creating new file with path: ${newPath}`);
        const updatedFile = new File(newPath, entry.content, entry.createdDate, entry.size, new Date());
        await this.fileSystemService.add(updatedFile);
        logger.debug(`Successfully renamed file to: ${updatedFile.fullPath}`);
      } else {
        logger.debug(`Creating new directory with path: ${newPath}`);
        const updatedDirectory = new Directory(newPath, entry.createdDate, new Date());
        await this.fileSystemService.add(updatedDirectory);
        logger.debug(`Successfully renamed directory to: ${updatedDirectory.fullPath}`);
      }
    } catch (error) {
      // If the rename fails, try to restore the original entry
      logger.error("Rename failed, attempting to restore original entry:", error);
      await this.fileSystemService.add(entry);
      throw error;
    }
  }

  async copyEntries(sourcePaths: string[], destinationPath: string): Promise<void> {
    // Validate that we can write to the destination path
    PermissionService.validatePath(destinationPath);

    for (const sourcePath of sourcePaths) {
      // Validate that we can read from the source path
      PermissionService.validatePath(sourcePath);

      const sourceEntry = await this.fileSystemService.get((e) => e.fullPath === sourcePath);
      if (!sourceEntry) continue;

      await this.copyEntryRecursive(sourceEntry, destinationPath);
    }
  }

  private async copyEntryRecursive(sourceEntry: FileSystemEntry, destinationPath: string): Promise<void> {
    const isDirectory = sourceEntry instanceof Directory;
    const uniqueName = await this.generateUniqueName(destinationPath, sourceEntry.name, isDirectory);

    // Manually construct the path to avoid PathUtils.normalize issues
    const destPath = destinationPath === "/" ? `/${uniqueName}` : `${destinationPath}/${uniqueName}`;

    // Validate the final destination path
    PermissionService.validatePath(destPath);

    logger.debug(`Copying: ${sourceEntry.name} -> ${uniqueName}`);
    logger.debug(`Destination path: ${destinationPath}, Unique name: ${uniqueName}, Combined path: ${destPath}`);

    if (sourceEntry instanceof File) {
      const newFile = new File(destPath, sourceEntry.content, new Date(), sourceEntry.size, new Date());
      await this.fileSystemService.add(newFile);
      logger.debug(`Created file with name: ${newFile.name} at path: ${newFile.fullPath}`);
    } else {
      // Create the directory first
      const newDirectory = new Directory(destPath, new Date());
      await this.fileSystemService.add(newDirectory);
      logger.debug(`Created directory with name: ${newDirectory.name} at path: ${newDirectory.fullPath}`);

      // Recursively copy all contents of the directory
      await this.copyDirectoryContents(sourceEntry.fullPath, destPath);
    }
  }

  private async copyDirectoryContents(sourceDirPath: string, destDirPath: string): Promise<void> {
    try {
      // Get all entries in the source directory
      const entries = await this.fileSystemService.getAll((entry) => {
        const entryDir = entry instanceof Directory ? entry.fullPath : (entry as File).directory || "/";
        return entryDir === sourceDirPath && entry.fullPath !== sourceDirPath;
      });

      for (const entry of entries) {
        if (entry instanceof File) {
          // Copy file to destination directory
          const destFilePath = destDirPath === "/" ? `/${entry.name}` : `${destDirPath}/${entry.name}`;
          const newFile = new File(destFilePath, entry.content, new Date(), entry.size, new Date());
          await this.fileSystemService.add(newFile);
          logger.debug(`Copied file: ${entry.name} to ${destFilePath}`);
        } else {
          // Recursively copy subdirectory
          const destSubDirPath = destDirPath === "/" ? `/${entry.name}` : `${destDirPath}/${entry.name}`;
          const newDirectory = new Directory(destSubDirPath, new Date());
          await this.fileSystemService.add(newDirectory);
          logger.debug(`Copied directory: ${entry.name} to ${destSubDirPath}`);

          // Recursively copy contents of subdirectory
          await this.copyDirectoryContents(entry.fullPath, destSubDirPath);
        }
      }
    } catch (error) {
      logger.error(`Error copying directory contents from ${sourceDirPath} to ${destDirPath}:`, error);
      throw new Error(`Failed to copy directory contents: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async moveEntries(sourcePaths: string[], destinationPath: string): Promise<void> {
    await this.copyEntries(sourcePaths, destinationPath);
    await this.deleteEntries(sourcePaths);
  }

  /**
   * Generate a unique name by adding suffix (1), (2), etc. if name already exists
   */
  private async generateUniqueName(parentPath: string, originalName: string, isDirectory: boolean): Promise<string> {
    // Check if original name is available
    const originalPath = PathUtils.normalize(parentPath, originalName);
    const originalExists = await this.pathExists(originalPath);

    if (!originalExists) {
      return originalName;
    }

    // Extract name and extension for files
    let nameWithoutExt = originalName;
    let extension = "";

    if (!isDirectory) {
      const lastDotIndex = originalName.lastIndexOf(".");
      if (lastDotIndex > 0) {
        nameWithoutExt = originalName.substring(0, lastDotIndex);
        extension = originalName.substring(lastDotIndex);
      }
    }

    // Try suffixes (1), (2), (3), etc.
    let suffix = 1;
    let uniqueName: string;

    do {
      uniqueName = `${nameWithoutExt} (${suffix})${extension}`;
      const testPath = PathUtils.normalize(parentPath, uniqueName);
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
}
