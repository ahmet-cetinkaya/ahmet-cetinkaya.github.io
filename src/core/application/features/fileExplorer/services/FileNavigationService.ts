import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import File from "@domain/models/File";
import { logger } from "@shared/utils/logger";
import { CACHE_CONFIG, UI_CONSTANTS } from "../constants";
import { FileSortCriteria, SortOrder } from "../models/FileSelection";
import { PathSanitizer } from "../utils/InputSanitizer";

/**
 * Handles file navigation, browsing, and UI state management
 * Separated from file operations for better separation of concerns
 */

export interface NavigationOptions {
  sortBy?: FileSortCriteria;
  sortOrder?: SortOrder;
  showHidden?: boolean;
  limit?: number;
  offset?: number;
}

export interface DirectoryContents {
  entries: FileSystemEntry[];
  totalCount: number;
  hasMore: boolean;
  currentPath: string;
  parentPath: string | null;
  navigationHistory: string[];
}

export interface NavigationCache {
  contents: DirectoryContents;
  timestamp: number;
  path: string;
}

export default class FileNavigationService {
  private navigationHistory: string[] = [];
  private currentHistoryIndex = -1;
  private cache = new Map<string, NavigationCache>();

  constructor(private readonly fileSystemService: IFileSystemService) {}

  /**
   * Get directory contents with sorting and filtering
   */
  async getDirectoryContents(path: string, options: NavigationOptions = {}): Promise<DirectoryContents> {
    try {
      // Validate and sanitize path
      PathSanitizer.validatePath(path);
      const normalizedPath = PathSanitizer.normalizePath(path);

      // Check cache first
      const cacheKey = this.getCacheKey(normalizedPath, options);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        logger.debug(`Using cached contents for: ${normalizedPath}`);
        return cached.contents;
      }

      // Get entries from file system
      let entries = await this.getImmediateChildren(normalizedPath);

      // Apply filters
      entries = this.applyFilters(entries, options);

      // Sort entries
      entries = this.sortEntries(entries, options);

      // Apply pagination
      const { paginatedEntries, totalCount, hasMore } = this.applyPagination(entries, options.limit, options.offset);

      // Get parent path
      const parentPath = this.getParentPath(normalizedPath);

      // Create result
      const result: DirectoryContents = {
        entries: paginatedEntries,
        totalCount,
        hasMore,
        currentPath: normalizedPath,
        parentPath,
        navigationHistory: [...this.navigationHistory],
      };

      // Cache the result
      this.addToCache(cacheKey, result);

      logger.debug(`Retrieved ${entries.length} entries for: ${normalizedPath}`);
      return result;
    } catch (error) {
      logger.error(`Failed to get directory contents for ${path}:`, error);
      throw error;
    }
  }

  /**
   * Navigate to a directory and update history
   */
  async navigateTo(path: string, options: NavigationOptions = {}): Promise<DirectoryContents> {
    const contents = await this.getDirectoryContents(path, options);

    // Update navigation history
    this.addToHistory(path);

    return contents;
  }

  /**
   * Navigate to parent directory
   */
  async navigateToParent(currentPath: string, options: NavigationOptions = {}): Promise<DirectoryContents | null> {
    const parentPath = this.getParentPath(currentPath);

    if (!parentPath) {
      return null; // Already at root
    }

    return this.navigateTo(parentPath, options);
  }

  /**
   * Navigate back in history
   */
  async navigateBack(): Promise<DirectoryContents | null> {
    if (this.canGoBack()) {
      this.currentHistoryIndex--;
      const path = this.navigationHistory[this.currentHistoryIndex];
      return this.getDirectoryContents(path);
    }
    return null;
  }

  /**
   * Navigate forward in history
   */
  async navigateForward(): Promise<DirectoryContents | null> {
    if (this.canGoForward()) {
      this.currentHistoryIndex++;
      const path = this.navigationHistory[this.currentHistoryIndex];
      return this.getDirectoryContents(path);
    }
    return null;
  }

  /**
   * Check if we can go back in history
   */
  canGoBack(): boolean {
    return this.currentHistoryIndex > 0;
  }

  /**
   * Check if we can go forward in history
   */
  canGoForward(): boolean {
    return this.currentHistoryIndex < this.navigationHistory.length - 1;
  }

  /**
   * Get navigation history
   */
  getNavigationHistory(): {
    history: string[];
    currentIndex: number;
    canGoBack: boolean;
    canGoForward: boolean;
  } {
    return {
      history: [...this.navigationHistory],
      currentIndex: this.currentHistoryIndex,
      canGoBack: this.canGoBack(),
      canGoForward: this.canGoForward(),
    };
  }

  /**
   * Clear navigation history
   */
  clearHistory(): void {
    this.navigationHistory = [];
    this.currentHistoryIndex = -1;
  }

  /**
   * Search for files and directories
   */
  async search(
    basePath: string,
    query: string,
    options: {
      maxResults?: number;
      includeContent?: boolean;
      caseSensitive?: boolean;
    } = {},
  ): Promise<FileSystemEntry[]> {
    const { maxResults = 100, includeContent = false, caseSensitive = false } = options;

    try {
      PathSanitizer.validatePath(basePath);

      const searchTerm = caseSensitive ? query : query.toLowerCase();
      const results: FileSystemEntry[] = [];

      // Get all entries recursively (with depth limit)
      const allEntries = await this.getAllEntriesRecursive(basePath);

      for (const entry of allEntries) {
        if (results.length >= maxResults) {
          break;
        }

        const searchTarget = caseSensitive ? entry.name : entry.name.toLowerCase();
        const matches = searchTarget.includes(searchTerm);

        if (matches) {
          results.push(entry);
        } else if (includeContent && entry instanceof File) {
          // Search file content (limited for performance)
          const content = caseSensitive ? entry.content : entry.content.toLowerCase();
          if (content.includes(searchTerm)) {
            results.push(entry);
          }
        }
      }

      logger.debug(`Search for "${query}" found ${results.length} results`);
      return results;
    } catch (error) {
      logger.error(`Search failed for query "${query}":`, error);
      throw error;
    }
  }

  /**
   * Get breadcrumbs for navigation
   */
  getBreadcrumbs(currentPath: string): Array<{ name: string; path: string }> {
    const normalizedPath = PathSanitizer.normalizePath(currentPath);
    const parts = normalizedPath.split("/").filter(Boolean);

    const breadcrumbs: Array<{ name: string; path: string }> = [{ name: "Home", path: "/" }];

    let currentPathBuilder = "/";
    for (const part of parts) {
      currentPathBuilder = PathSanitizer.joinPath(currentPathBuilder, part);
      breadcrumbs.push({
        name: part,
        path: currentPathBuilder,
      });
    }

    return breadcrumbs;
  }

  /**
   * Get file system statistics
   */
  async getStatistics(path: string): Promise<{
    totalFiles: number;
    totalDirectories: number;
    totalSize: number;
    largestFile?: { name: string; size: number; path: string };
  }> {
    try {
      PathSanitizer.validatePath(path);

      const allEntries = await this.getAllEntriesRecursive(path);
      let totalFiles = 0;
      let totalDirectories = 0;
      let totalSize = 0;
      let largestFile: { name: string; size: number; path: string } | undefined;

      for (const entry of allEntries) {
        if (entry instanceof File) {
          totalFiles++;
          totalSize += entry.size;

          if (!largestFile || entry.size > largestFile.size) {
            largestFile = {
              name: entry.name,
              size: entry.size,
              path: entry.fullPath,
            };
          }
        } else {
          totalDirectories++;
        }
      }

      return {
        totalFiles,
        totalDirectories,
        totalSize,
        largestFile,
      };
    } catch (error) {
      logger.error(`Failed to get statistics for ${path}:`, error);
      throw error;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    logger.debug("Navigation cache cleared");
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; totalEntries: number } {
    return {
      size: this.cache.size,
      totalEntries: Array.from(this.cache.values()).reduce((sum, cached) => sum + cached.contents.entries.length, 0),
    };
  }

  /**
   * Get immediate children of a directory
   */
  private async getImmediateChildren(path: string): Promise<FileSystemEntry[]> {
    return this.fileSystemService.getChildren(path);
  }

  /**
   * Apply filters to entries
   */
  private applyFilters(entries: FileSystemEntry[], options: NavigationOptions): FileSystemEntry[] {
    let filtered = [...entries];

    // Filter hidden files
    if (!options.showHidden) {
      filtered = filtered.filter((entry) => !entry.name.startsWith("."));
    }

    return filtered;
  }

  /**
   * Sort entries
   */
  private sortEntries(entries: FileSystemEntry[], options: NavigationOptions): FileSystemEntry[] {
    const sortBy = options.sortBy || UI_CONSTANTS.DEFAULT_SORT_BY;
    const sortOrder = options.sortOrder || UI_CONSTANTS.DEFAULT_SORT_ORDER;

    return entries.sort((a, b) => {
      // Directories always come first
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;

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
  }

  /**
   * Apply pagination
   */
  private applyPagination(
    entries: FileSystemEntry[],
    limit?: number,
    offset?: number,
  ): { paginatedEntries: FileSystemEntry[]; totalCount: number; hasMore: boolean } {
    const totalCount = entries.length;
    const actualOffset = offset || 0;
    const actualLimit = limit || UI_CONSTANTS.MAX_VISIBLE_ITEMS;

    const paginatedEntries = entries.slice(actualOffset, actualOffset + actualLimit);
    const hasMore = actualOffset + actualLimit < totalCount;

    return {
      paginatedEntries,
      totalCount,
      hasMore,
    };
  }

  /**
   * Get all entries recursively (with depth limit)
   */
  private async getAllEntriesRecursive(path: string, maxDepth: number = 10): Promise<FileSystemEntry[]> {
    const allEntries: FileSystemEntry[] = [];
    const queue: Array<{ path: string; depth: number }> = [{ path, depth: 0 }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { path: currentPath, depth } = queue.shift()!;

      if (depth >= maxDepth || visited.has(currentPath)) {
        continue;
      }

      visited.add(currentPath);

      try {
        const children = await this.getImmediateChildren(currentPath);
        allEntries.push(...children);

        // Add directories to queue for further traversal
        for (const child of children) {
          if (child.isDirectory) {
            queue.push({ path: child.fullPath, depth: depth + 1 });
          }
        }
      } catch (error) {
        logger.warn(`Error accessing directory ${currentPath}:`, error);
        // Continue with other directories
      }
    }

    return allEntries;
  }

  /**
   * Get parent path
   */
  private getParentPath(path: string): string | null {
    if (path === "/") {
      return null;
    }

    const parentPath = PathSanitizer.getDirectoryPath(path);
    return parentPath !== path ? parentPath : "/";
  }

  /**
   * Add path to navigation history
   */
  private addToHistory(path: string): void {
    // Remove any forward history when navigating to a new path
    if (this.currentHistoryIndex < this.navigationHistory.length - 1) {
      this.navigationHistory = this.navigationHistory.slice(0, this.currentHistoryIndex + 1);
    }

    // Add new path
    this.navigationHistory.push(path);
    this.currentHistoryIndex = this.navigationHistory.length - 1;

    // Limit history size
    if (this.navigationHistory.length > 50) {
      this.navigationHistory.shift();
      this.currentHistoryIndex--;
    }
  }

  /**
   * Get cache key
   */
  private getCacheKey(path: string, options: NavigationOptions): string {
    const optionsStr = JSON.stringify({
      sortBy: options.sortBy,
      sortOrder: options.sortOrder,
      showHidden: options.showHidden,
      limit: options.limit,
      offset: options.offset,
    });
    return `${path}:${optionsStr}`;
  }

  /**
   * Get from cache
   */
  private getFromCache(key: string): NavigationCache | null {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    // Check if cache is still valid
    const now = Date.now();
    if (now - cached.timestamp > CACHE_CONFIG.DIRECTORY_CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return cached;
  }

  /**
   * Add to cache
   */
  private addToCache(key: string, contents: DirectoryContents): void {
    // Cleanup cache if needed
    if (this.cache.size >= CACHE_CONFIG.MAX_CACHE_ITEMS) {
      // Remove oldest 25% of entries
      const entriesToDelete = Math.floor(CACHE_CONFIG.MAX_CACHE_ITEMS * 0.25);
      const keys = Array.from(this.cache.keys()).slice(0, entriesToDelete);
      keys.forEach((k) => this.cache.delete(k));
    }

    this.cache.set(key, {
      contents,
      timestamp: Date.now(),
      path: contents.currentPath,
    });
  }
}
