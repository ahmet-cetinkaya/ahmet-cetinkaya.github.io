import type { Path } from "./File";

type DirectoryId = Path;

/**
 * Factory function for creating a Directory with validation
 */
export function createDirectory(id: Path, createdDate: Date, updatedDate?: Date): Directory {
  if (!id || typeof id !== "string") {
    throw new Error("Directory id must be a non-empty string");
  }
  if (!id.startsWith("/")) {
    throw new Error(`Directory id must be an absolute path starting with "/", got "${id}"`);
  }
  return new Directory(id, createdDate, updatedDate);
}

export default class Directory {
  constructor(id: Path, createdDate: Date, updatedDate?: Date) {
    // Validate path format in constructor
    if (!id.startsWith("/")) {
      throw new Error(`Invalid directory path: must start with "/", got "${id}"`);
    }
    this.id = id;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }

  readonly id: Path;
  readonly createdDate: Date;
  readonly updatedDate?: Date;

  get name(): string {
    return this.id.split("/").pop() || "";
  }

  get parent(): DirectoryId {
    const parts = this.id.split("/").filter(Boolean);
    if (parts.length === 0) {
      // This is the root directory "/", it has no parent
      return "";
    }
    return `/${parts.slice(0, -1).join("/")}`;
  }

  get isRoot(): boolean {
    return this.id === "/";
  }

  get fullPath(): string {
    return this.id;
  }

  get isDirectory(): boolean {
    return true;
  }

  get isFile(): boolean {
    return false;
  }
}
