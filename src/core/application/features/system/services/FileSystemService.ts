import { logger } from "@application/shared/logger";

import GitHubService from "@application/features/fileExplorer/services/GitHubService";
import DataService from "@application/shared/DataService";
import DirectoryData, { Paths } from "@domain/data/Directories";
import FilesData from "@domain/data/Files";
import Directory from "@domain/models/Directory";
import File from "@domain/models/File";
import type IFileSystemService from "./abstraction/IFileSystemService";
import type { FileChangeListener, FileChangeType, FileSystemEntry } from "./abstraction/IFileSystemService";

export default class FileSystemService extends DataService<FileSystemEntry> implements IFileSystemService {
  private listeners: FileChangeListener[] = [];
  private gitHubService = new GitHubService();
  private readonly codePath = `${Paths.USER_HOME}/Code`;

  protected loadData(): FileSystemEntry[] {
    return [...DirectoryData, ...FilesData];
  }

  addListener(listener: FileChangeListener): void {
    this.listeners.push(listener);
  }

  removeListener(listener: FileChangeListener): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners(type: FileChangeType, entry: FileSystemEntry): void {
    this.listeners.forEach((listener) => listener({ type, entry }));
  }

  private isDesktopFile(entry: FileSystemEntry): boolean {
    return !!entry.fullPath && entry.fullPath.endsWith(".desktop");
  }

  async add(item: FileSystemEntry): Promise<void> {
    await this.ensureDataLoaded();

    this.data!.push(item);

    if (this.isDesktopFile(item)) {
      this.notifyListeners("add", item);
    }
  }

  async update(item: FileSystemEntry): Promise<void> {
    await this.ensureDataLoaded();

    const index = this.data!.findIndex((x) => x.id === item.id);
    if (index === -1) throw new Error("File system entry not found");

    const updatedItem = Object.assign(Object.create(Object.getPrototypeOf(item)), item, {
      updatedDate: new Date(),
    }) as FileSystemEntry;
    this.data![index] = updatedItem;

    if (this.isDesktopFile(item)) {
      this.notifyListeners("update", item);
    }
  }

  async remove(predicate: (x: FileSystemEntry) => boolean): Promise<void> {
    await this.ensureDataLoaded();

    const index = this.data!.findIndex(predicate);
    if (index === -1) throw new Error("File system entry not found");

    const removedEntry = this.data![index];
    this.data!.splice(index, 1);

    if (this.isDesktopFile(removedEntry)) {
      this.notifyListeners("remove", removedEntry);
    }
  }

  async resolvePath(path: string): Promise<FileSystemEntry | null> {
    await this.ensureDataLoaded();

    // Try to find in local cache first
    const localEntry = this.data!.find((e) => e.fullPath === path);
    if (localEntry) return localEntry;

    // If not found and it's a GitHub path, try to fetch it
    if (path.startsWith(this.codePath) && path !== this.codePath) {
      try {
        const relativePath = path.substring(this.codePath.length + 1);
        const parts = relativePath.split("/");

        if (parts.length === 1) {
          await this.fetchRepositories();
          return this.data!.find((e) => e.fullPath === path) ?? null;
        }

        const parentPath = path.substring(0, path.lastIndexOf("/"));
        await this.getChildren(parentPath);

        return this.data!.find((e) => e.fullPath === path) ?? null;
      } catch (error) {
        logger.error(`Failed to resolve path ${path}:`, error);
        return null;
      }
    }

    return null;
  }

  async getChildren(path: string): Promise<FileSystemEntry[]> {
    await this.ensureDataLoaded();

    // If it's the Code directory, fetch repositories
    if (path === this.codePath) {
      await this.fetchRepositories();
    }
    // If it's inside a repo, fetch contents
    else if (path.startsWith(this.codePath) && path !== this.codePath) {
      await this.fetchRepoContents(path);
    }

    // Return children from local cache (which is now updated)
    return this.data!.filter((entry) => {
      if (entry instanceof Directory) {
        return entry.parent === path;
      }
      // For files, we need to check the directory property or calculate parent
      const parentPath = entry.fullPath.substring(0, entry.fullPath.lastIndexOf("/"));
      return parentPath === path;
    });
  }

  private async fetchRepositories(): Promise<void> {
    const repos = await this.gitHubService.getRepositories();

    for (const repo of repos) {
      const repoPath = `${this.codePath}/${repo.name}`;
      if (!this.data!.some((e) => e.fullPath === repoPath)) {
        this.data!.push(new Directory(repoPath, new Date(repo.updated_at)));
      }
    }
  }

  private parseGitHubPath(path: string): { repoName: string; repoPath: string } {
    const relativePath = path.substring(this.codePath.length + 1);
    const parts = relativePath.split("/");
    return { repoName: parts[0], repoPath: parts.slice(1).join("/") };
  }

  private async fetchRepoContents(path: string): Promise<void> {
    const { repoName, repoPath } = this.parseGitHubPath(path);

    try {
      const contents = await this.gitHubService.getContents(repoName, repoPath);
      const items = Array.isArray(contents) ? contents : [contents];

      for (const item of items) {
        const itemPath = `${path}/${item.name}`;

        // Check if already exists to avoid duplicates
        if (this.data!.some((e) => e.fullPath === itemPath)) continue;

        if (item.type === "dir") {
          const now = new Date();
          this.data!.push(new Directory(itemPath, now, now));
        } else {
          // Fetch the last modified date from GitHub commits
          const modifiedDate = await this.gitHubService.getLastModifiedDate(repoName, item.name);
          const createdDate = modifiedDate || new Date();
          const updatedDate = modifiedDate || new Date();

          this.data!.push(new File(itemPath, "", createdDate, item.size, updatedDate));
        }
      }
    } catch (error) {
      logger.error(`Failed to fetch repo contents from ${path}:`, error);
    }
  }

  async readFileContent(path: string): Promise<string> {
    await this.ensureDataLoaded();

    const entry = await this.resolvePath(path);
    if (!entry || !(entry instanceof File)) {
      throw new Error("File not found");
    }

    // If it's a GitHub file and content is empty (or placeholder), fetch it
    if (path.startsWith(this.codePath) && path !== this.codePath && !entry.content) {
      const { repoName, repoPath } = this.parseGitHubPath(path);

      try {
        const content = await this.gitHubService.getFileContent(repoName, repoPath);
        entry.content = content;
        return content;
      } catch (error) {
        logger.error(`Failed to read file content from ${repoPath}:`, error);
        return entry.content;
      }
    }

    return entry.content;
  }
}
