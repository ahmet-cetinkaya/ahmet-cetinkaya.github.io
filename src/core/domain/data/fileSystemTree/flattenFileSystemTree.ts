import Directory from "@domain/models/Directory";
import File from "@domain/models/File";
import type { FileSystemTreeDirectoryNode, FileSystemTreeFileNode, FileSystemTreeNode } from "./FileSystemTree";

type FlattenedFileSystemTree = {
  directories: Directory[];
  files: File[];
};

function buildPath(parentPath: string, name: string): string {
  if (!name) {
    return parentPath || "/";
  }

  if (!parentPath || parentPath === "/") {
    return `/${name}`;
  }

  return `${parentPath}/${name}`;
}

function createDirectory(node: FileSystemTreeDirectoryNode, path: string): Directory {
  return new Directory(path, node.createdDate, node.updatedDate);
}

function createFile(node: FileSystemTreeFileNode, path: string): File {
  return new File(path, node.content, node.createdDate, node.size, node.updatedDate);
}

function flattenNode(
  node: FileSystemTreeNode,
  parentPath: string,
  flattenedTree: FlattenedFileSystemTree,
): FlattenedFileSystemTree {
  const path = buildPath(parentPath, node.name);

  if (node.kind === "file") {
    return {
      ...flattenedTree,
      files: [...flattenedTree.files, createFile(node, path)],
    };
  }

  const nextFlattenedTree = {
    ...flattenedTree,
    directories: [...flattenedTree.directories, createDirectory(node, path)],
  };

  return (node.children ?? []).reduce(
    (currentFlattenedTree, childNode) => flattenNode(childNode, path, currentFlattenedTree),
    nextFlattenedTree,
  );
}

export default function flattenFileSystemTree(rootNode: FileSystemTreeDirectoryNode): FlattenedFileSystemTree {
  return flattenNode(rootNode, "", { directories: [], files: [] });
}
