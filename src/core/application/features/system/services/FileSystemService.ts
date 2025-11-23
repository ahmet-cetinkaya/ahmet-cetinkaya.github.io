import DirectoryData from "@domain/data/Directories";
import FilesData from "@domain/data/Files";
import PaginationResult from "@packages/acore-ts/repository/PaginationResult";
import type IFileSystemService from "./abstraction/IFileSystemService";
import type { FileChangeListener, FileChangeType, FileSystemEntry } from "./abstraction/IFileSystemService";

export default class FileSystemService implements IFileSystemService {
  private data?: FileSystemEntry[];
  private listeners: FileChangeListener[] = [];

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
    return entry.fullPath && entry.fullPath.endsWith(".desktop");
  }

  private async ensureDataLoaded(): Promise<void> {
    if (!this.data) this.data = [...DirectoryData, ...FilesData];
  }

  async getAll(predicate?: ((x: FileSystemEntry) => boolean) | undefined): Promise<FileSystemEntry[]> {
    this.ensureDataLoaded();
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
}
