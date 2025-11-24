import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import { default as Directory, default as File } from "@domain/models/File";
import FileNavigationService from "./FileNavigationService";
import FileOperationsService from "./FileOperationsService";

import { UI_CONSTANTS } from "../constants";
import { globalOperationQueue } from "../utils/OperationQueue";

import {
  FileSortCriteria,
  FileViewMode,
  SortOrder,
  type FileExplorerState,
  type SelectedFile,
} from "../models/FileSelection";

import type { NavigationOptions } from "./FileNavigationService";

export interface DirectoryContents {
  entries: Array<{
    name: string;
    path: string;
    type: "file" | "directory";
    size?: number;
    modified?: Date;
  }>;
  totalCount: number;
  path: string;
  isLoading: boolean;
}

export { FileSortCriteria, FileViewMode, SortOrder, type FileExplorerState, type SelectedFile };

export default class FileExplorerService {
  private readonly operationsService: FileOperationsService;
  private readonly navigationService: FileNavigationService;

  constructor(private readonly fileSystemService: IFileSystemService) {
    this.operationsService = new FileOperationsService(fileSystemService);
    this.navigationService = new FileNavigationService(fileSystemService);
  }

  async getDirectoryContents(path: string, options: Partial<FileExplorerState> = {}): Promise<FileSystemEntry[]> {
    const navigationOptions: NavigationOptions = {
      sortBy: options.sortBy || UI_CONSTANTS.DEFAULT_SORT_BY,
      sortOrder: options.sortOrder || UI_CONSTANTS.DEFAULT_SORT_ORDER,
      showHidden: options.showHidden || false,
    };

    const result = await this.navigationService.getDirectoryContents(path, navigationOptions);
    return result.entries;
  }

  async getDetailedDirectoryContents(
    path: string,
    options: Partial<FileExplorerState> = {},
  ): Promise<DirectoryContents> {
    const navigationOptions: NavigationOptions = {
      sortBy: options.sortBy || UI_CONSTANTS.DEFAULT_SORT_BY,
      sortOrder: options.sortOrder || UI_CONSTANTS.DEFAULT_SORT_ORDER,
      showHidden: options.showHidden || false,
    };

    const navigationResult = await this.navigationService.getDirectoryContents(path, navigationOptions);

    return {
      entries: navigationResult.entries.map((entry) => ({
        name: entry.name,
        path: entry.fullPath,
        type: entry instanceof File ? "file" : "directory",
        size: entry instanceof File ? entry.size : undefined,
        modified: entry instanceof File ? entry.updatedDate : undefined,
      })),
      totalCount: navigationResult.totalCount,
      path: navigationResult.currentPath,
      isLoading: false,
    };
  }

  async navigateTo(path: string, options: Partial<FileExplorerState> = {}): Promise<DirectoryContents> {
    const navigationOptions: NavigationOptions = {
      sortBy: options.sortBy || UI_CONSTANTS.DEFAULT_SORT_BY,
      sortOrder: options.sortOrder || UI_CONSTANTS.DEFAULT_SORT_ORDER,
      showHidden: options.showHidden || false,
    };

    const navigationResult = await this.navigationService.navigateTo(path, navigationOptions);

    return {
      entries: navigationResult.entries.map((entry) => ({
        name: entry.name,
        path: entry.fullPath,
        type: entry instanceof File ? "file" : "directory",
        size: entry instanceof File ? entry.size : undefined,
        modified: entry instanceof File ? entry.updatedDate : undefined,
      })),
      totalCount: navigationResult.totalCount,
      path: navigationResult.currentPath,
      isLoading: false,
    };
  }

  async navigateToParent(
    currentPath: string,
    options: Partial<FileExplorerState> = {},
  ): Promise<DirectoryContents | null> {
    const navigationOptions: NavigationOptions = {
      sortBy: options.sortBy || UI_CONSTANTS.DEFAULT_SORT_BY,
      sortOrder: options.sortOrder || UI_CONSTANTS.DEFAULT_SORT_ORDER,
      showHidden: options.showHidden || false,
    };

    const navigationResult = await this.navigationService.navigateToParent(currentPath, navigationOptions);

    if (!navigationResult) {
      return null;
    }

    return {
      entries: navigationResult.entries.map((entry) => ({
        name: entry.name,
        path: entry.fullPath,
        type: entry instanceof File ? "file" : "directory",
        size: entry instanceof File ? entry.size : undefined,
        modified: entry instanceof File ? entry.updatedDate : undefined,
      })),
      totalCount: navigationResult.totalCount,
      path: navigationResult.currentPath,
      isLoading: false,
    };
  }

  async search(
    basePath: string,
    query: string,
    options: {
      maxResults?: number;
      includeContent?: boolean;
      caseSensitive?: boolean;
    } = {},
  ): Promise<FileSystemEntry[]> {
    return this.navigationService.search(basePath, query, options);
  }

  getBreadcrumbs(currentPath: string): Array<{ name: string; path: string }> {
    return this.navigationService.getBreadcrumbs(currentPath);
  }

  async getStatistics(path: string): Promise<{
    totalFiles: number;
    totalDirectories: number;
    totalSize: number;
    largestFile?: { name: string; size: number; path: string };
  }> {
    return this.navigationService.getStatistics(path);
  }

  async createDirectory(parentPath: string, name: string): Promise<{ directory: Directory; actualName: string }> {
    return this.operationsService.createDirectory(parentPath, name);
  }

  async createFile(parentPath: string, name: string, content?: string): Promise<{ file: File; actualName: string }> {
    return this.operationsService.createFile(parentPath, name, content);
  }

  async createFolder(parentPath: string, name: string): Promise<{ directory: Directory; actualName: string }> {
    return this.operationsService.createDirectory(parentPath, name);
  }

  async deleteEntries(paths: string[]): Promise<void> {
    return this.operationsService.deleteEntries(paths);
  }

  async copyEntries(sourcePaths: string[], destinationPath: string): Promise<void> {
    return this.operationsService.copyEntries(sourcePaths, destinationPath);
  }

  async moveEntries(sourcePaths: string[], destinationPath: string): Promise<void> {
    return this.operationsService.moveEntries(sourcePaths, destinationPath);
  }

  async renameEntry(oldPath: string, newName: string): Promise<void> {
    return this.operationsService.renameEntry(oldPath, newName);
  }

  async pathExists(path: string): Promise<boolean> {
    if (path === "/") return true;

    try {
      const entry = await this.fileSystemService.get((e) => e.fullPath === path);
      return Boolean(entry);
    } catch {
      return false;
    }
  }

  async getEntryType(path: string): Promise<"file" | "directory" | null> {
    try {
      const entry = await this.fileSystemService.get((e) => e.fullPath === path);
      if (!entry) return null;
      return entry instanceof Directory ? "directory" : "file";
    } catch {
      return null;
    }
  }

  getOperationQueueInfo() {
    return globalOperationQueue.getQueueInfo();
  }

  cancelOperation(operationId: string): boolean {
    return globalOperationQueue.cancel(operationId);
  }

  clearAllCaches(): void {
    this.navigationService.clearCache();
  }

  getCacheStats(): {
    navigation: { size: number; totalEntries: number };
    operations: { configCacheSize: number; pathCacheSize: number };
  } {
    return {
      navigation: this.navigationService.getCacheStats(),
      operations: this.getOperationCacheStats(),
    };
  }

  async getFilesInSubdirectories(path: string): Promise<Map<string, FileSystemEntry[]>> {
    const result = new Map<string, FileSystemEntry[]>();

    try {
      const allEntries = await this.navigationService.search(path, "*", {
        maxResults: 1000,
        includeContent: false,
      });

      for (const entry of allEntries) {
        if (entry instanceof File) {
          const dirPath = entry.directory || "/";
          if (!result.has(dirPath)) {
            result.set(dirPath, []);
          }
          result.get(dirPath)!.push(entry);
        }
      }

      return result;
    } catch {
      return new Map();
    }
  }

  private getOperationCacheStats(): { configCacheSize: number; pathCacheSize: number } {
    return {
      configCacheSize: 0,
      pathCacheSize: 0,
    };
  }
}
