import type {
  IAddable,
  IGettable,
  IListable,
  IRemovable,
  IUpdatable,
} from "~/core/acore-ts/repository/abstraction/IRepository";
import type Directory from "~/domain/models/Directory";
import type File from "~/domain/models/File";

export type FileSystemEntry = Directory | File;

export default interface IFileSystemService
  extends IListable<FileSystemEntry>,
    IGettable<FileSystemEntry>,
    IAddable<FileSystemEntry>,
    IUpdatable<FileSystemEntry>,
    IRemovable<FileSystemEntry> {}
