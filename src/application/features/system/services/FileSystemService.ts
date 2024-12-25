import PaginationResult from "~/core/acore-ts/repository/PaginationResult";
import DirectoryData from "~/domain/data/Directories";
import FilesData from "~/domain/data/Files";
import type IFileSystemService from "./abstraction/IFileSystemService";
import type { FileSystemEntry } from "./abstraction/IFileSystemService";

export default class FileSystemService implements IFileSystemService {
  private data?: FileSystemEntry[];

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
  }

  async update(item: FileSystemEntry): Promise<void> {
    await this.ensureDataLoaded();

    const index = this.data!.findIndex((x) => x.id === item.id);
    if (index === -1) throw new Error("File system entry not found");

    item.updatedDate = new Date();
    this.data![index] = item;
  }

  async remove(predicate: (x: FileSystemEntry) => boolean): Promise<void> {
    await this.ensureDataLoaded();

    const index = this.data!.findIndex(predicate);
    if (index === -1) throw new Error("File system entry not found");

    this.data!.splice(index, 1);
  }
}
