import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import fileSystemTree from "@domain/data/fileSystemTree/FileSystemTree";
import flattenFileSystemTree from "@domain/data/fileSystemTree/flattenFileSystemTree";
import type Directory from "@domain/models/Directory";
import type File from "@domain/models/File";

interface FileSystemSeedRegistry {
  readonly directories: Directory[];
  readonly files: File[];
  readonly entries: FileSystemEntry[];
}

const flattened = flattenFileSystemTree(fileSystemTree);

const FileSystemSeedRegistry: FileSystemSeedRegistry = {
  directories: flattened.directories,
  files: flattened.files,
  entries: [...flattened.directories, ...flattened.files],
};

export default FileSystemSeedRegistry;
