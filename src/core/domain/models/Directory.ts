import type { Path } from "./File";

type DirectoryId = Path;

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
