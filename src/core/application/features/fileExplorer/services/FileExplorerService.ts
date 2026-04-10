import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import Directory from "@domain/models/Directory";
import File from "@domain/models/File";
import { logger } from "@shared/utils/logger";
import FileNavigationService from "./FileNavigationService";
import FileOperationsService from "./FileOperationsService";
import GameExecutionService from "./GameExecutionService";

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
  private static instance: FileExplorerService | null = null;

  private readonly operationsService: FileOperationsService;
  private readonly navigationService: FileNavigationService;
  private readonly gameExecutionService: GameExecutionService;

  private constructor(
    private readonly fileSystemService: IFileSystemService,
    private readonly windowsService?: IWindowsService,
  ) {
    this.operationsService = new FileOperationsService(fileSystemService);
    this.navigationService = new FileNavigationService(fileSystemService);
    this.gameExecutionService = windowsService ? new GameExecutionService(windowsService) : null!;
  }

  static getInstance(fileSystemService: IFileSystemService, windowsService?: IWindowsService): FileExplorerService {
    if (!FileExplorerService.instance || FileExplorerService.instance.fileSystemService !== fileSystemService) {
      FileExplorerService.instance = new FileExplorerService(fileSystemService, windowsService);
    }
    return FileExplorerService.instance;
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
    return await this.operationsService.createDirectory(parentPath, name);
  }

  async createFile(parentPath: string, name: string, content?: string): Promise<{ file: File; actualName: string }> {
    return await this.operationsService.createFile(parentPath, name, content);
  }

  async createFolder(parentPath: string, name: string): Promise<{ directory: Directory; actualName: string }> {
    return await this.operationsService.createDirectory(parentPath, name);
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
    } catch (error) {
      logger.debug(`pathExists: Error checking path ${path}`, error);
      return false;
    }
  }

  async getEntryType(path: string): Promise<"file" | "directory" | null> {
    try {
      const entry = await this.fileSystemService.get((e) => e.fullPath === path);
      if (!entry) return null;
      return entry instanceof Directory ? "directory" : "file";
    } catch (error) {
      logger.debug(`getEntryType: Error getting entry type for ${path}`, error);
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
    } catch (error) {
      logger.debug(`getFilesInSubdirectories: Error for ${path}`, error);
      return new Map();
    }
  }

  private getOperationCacheStats(): { configCacheSize: number; pathCacheSize: number } {
    return {
      configCacheSize: 0,
      pathCacheSize: 0,
    };
  }

  // File handler methods
  hasRegisteredHandler(entry: FileSystemEntry): boolean {
    // Currently only games are supported as executable files
    // This method is designed to be extensible for future file associations
    return this.gameExecutionService ? this.gameExecutionService.isGameExecutable(entry) : false;
  }

  // Game-related methods
  isGameExecutable(entry: FileSystemEntry): boolean {
    return this.gameExecutionService ? this.gameExecutionService.isGameExecutable(entry) : false;
  }

  getGameExecutable(entry: FileSystemEntry) {
    return this.gameExecutionService ? this.gameExecutionService.getGameExecutable(entry) : null;
  }

  async launchGame(entry: FileSystemEntry, options?: { maximized?: boolean }): Promise<void> {
    if (!this.gameExecutionService) {
      throw new Error("Game execution service not available");
    }
    return this.gameExecutionService.launchGame(entry, options);
  }

  getSupportedGameExtensions(): string[] {
    return this.gameExecutionService ? this.gameExecutionService.getSupportedGameExtensions() : [];
  }

  isGamesDirectory(path: string): boolean {
    return this.gameExecutionService ? this.gameExecutionService.isGamesDirectory(path) : false;
  }

  getGameLaunchCommand(entry: FileSystemEntry): string | null {
    return this.gameExecutionService ? this.gameExecutionService.getGameLaunchCommand(entry) : null;
  }

  getAllGameExecutables() {
    return this.gameExecutionService ? this.gameExecutionService.getAllGameExecutables() : [];
  }
}
