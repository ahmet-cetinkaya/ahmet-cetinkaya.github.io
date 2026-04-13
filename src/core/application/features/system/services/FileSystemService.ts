import GitHubService from "@application/features/fileExplorer/services/GitHubService";
import DirectoryData, { Paths } from "@domain/data/Directories";
import FilesData from "@domain/data/Files";
import Directory from "@domain/models/Directory";
import File from "@domain/models/File";
import PaginationResult from "@packages/acore-ts/repository/PaginationResult";
import type IFileSystemService from "./abstraction/IFileSystemService";
import type { FileChangeListener, FileChangeType, FileSystemEntry } from "./abstraction/IFileSystemService";

export default class FileSystemService implements IFileSystemService {
  private data?: FileSystemEntry[];
  private listeners: FileChangeListener[] = [];
  private gitHubService = new GitHubService();
  private readonly codePath = `${Paths.USER_HOME}/Code`;

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

  private async ensureDataLoaded(): Promise<void> {
    if (!this.data) this.data = [...DirectoryData, ...FilesData];
  }

  async getAll(predicate?: ((x: FileSystemEntry) => boolean) | undefined): Promise<FileSystemEntry[]> {
    await this.ensureDataLoaded();
    return predicate ? this.data!.filter(predicate) : this.data!;
  }

  async getList(
    pageIndex: number,
    pageSize: number,
    predicate?: ((x: FileSystemEntry) => boolean) | undefined,
  ): Promise<PaginationResult<FileSystemEntry>> {
    await this.ensureDataLoaded();

    const query = predicate ? this.data!.filter(predicate) : this.data!;
    const totalItems = query.length;
    const items = query.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    return new PaginationResult<FileSystemEntry>(pageIndex, pageSize, items, totalItems);
  }

  async get(predicate: (x: FileSystemEntry) => boolean): Promise<FileSystemEntry | null> {
    await this.ensureDataLoaded();

    return this.data!.find(predicate) ?? null;
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

    item.updatedDate = new Date();
    this.data![index] = item;

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
        // We can't easily resolve a single file without listing the parent or knowing it exists
        // But for now, let's assume if we are resolving it, we might have listed it before.
        // If not, we might need to fetch the parent.
        // However, for performance, let's try to deduce the repo and path.
        const relativePath = path.substring(this.codePath.length + 1);
        const parts = relativePath.split("/");

        if (parts.length === 1) {
          // It's a repo root. We should have fetched it when listing Code dir.
          // But if we haven't, let's try to fetch repos.
          await this.fetchRepositories();
          return this.data!.find((e) => e.fullPath === path) ?? null;
        }

        // It's a file or dir inside a repo
        // We can't fetch a single metadata easily without the parent listing usually,
        // but we can try to fetch the parent directory contents.
        const parentPath = path.substring(0, path.lastIndexOf("/"));
        await this.getChildren(parentPath);

        return this.data!.find((e) => e.fullPath === path) ?? null;
      } catch {
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

  private async fetchRepoContents(path: string): Promise<void> {
    const relativePath = path.substring(this.codePath.length + 1);
    const parts = relativePath.split("/");
    const repoName = parts[0];
    const repoPath = parts.slice(1).join("/");

    try {
      const contents = await this.gitHubService.getContents(repoName, repoPath);
      const items = Array.isArray(contents) ? contents : [contents];

      for (const item of items) {
        const itemPath = `${path}/${item.name}`;

        // Check if already exists to avoid duplicates
        if (this.data!.some((e) => e.fullPath === itemPath)) continue;

        if (item.type === "dir") {
          // For directories, use current date as we don't have specific directory modification dates
          // In the future, could track commits within the directory
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
    } catch {
      // Ignore errors (e.g. empty repo or network issue)
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
      const relativePath = path.substring(this.codePath.length + 1);
      const parts = relativePath.split("/");
      const repoName = parts[0];
      const repoPath = parts.slice(1).join("/");

      try {
        const content = await this.gitHubService.getFileContent(repoName, repoPath);
        entry.content = content;
        return content;
      } catch {
        // Fallback to existing content if fetch fails
        return entry.content;
      }
    }

    return entry.content;
  }
}
