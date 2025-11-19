import type Directory from "@domain/models/Directory";
import type File from "@domain/models/File";
import type {
  IAddable,
  IGettable,
  IListable,
  IRemovable,
  IUpdatable,
} from "@packages/acore-ts/repository/abstraction/IRepository";

export type FileSystemEntry = Directory | File;

export default interface IFileSystemService
  extends IListable<FileSystemEntry>,
    IGettable<FileSystemEntry>,
    IAddable<FileSystemEntry>,
    IUpdatable<FileSystemEntry>,
    IRemovable<FileSystemEntry> {}
