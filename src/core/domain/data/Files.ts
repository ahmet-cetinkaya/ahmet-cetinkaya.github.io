import File from "@domain/models/File";
import fileSystemTree from "./fileSystemTree/FileSystemTree";
import flattenFileSystemTree from "./fileSystemTree/flattenFileSystemTree";

const { files } = flattenFileSystemTree(fileSystemTree);

const FilesData: File[] = files;

export default FilesData;
