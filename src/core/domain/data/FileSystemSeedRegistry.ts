import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import { Paths } from "@domain/data/Directories";
import fileSystemTree from "@domain/data/fileSystemTree/FileSystemTree";
import flattenFileSystemTree from "@domain/data/fileSystemTree/flattenFileSystemTree";

const flattenedFileSystemTree = flattenFileSystemTree(fileSystemTree);
const directoryEntries = flattenedFileSystemTree.directories;
const fileEntries = flattenedFileSystemTree.files;
const fileSystemEntries: FileSystemEntry[] = [...directoryEntries, ...fileEntries];

const FileSystemSeedRegistry = {
  directories: directoryEntries,
  files: fileEntries,
  entries: fileSystemEntries,
};

export { directoryEntries, fileEntries, fileSystemEntries, Paths };
export default FileSystemSeedRegistry;
