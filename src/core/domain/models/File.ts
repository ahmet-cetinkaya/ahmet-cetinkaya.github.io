import Entity from "@packages/acore-ts/domain/abstraction/Entity";

type FileId = Path;
export type Path = string;

export default class File extends Entity<FileId> {
  private _content: string;

  constructor(
    id: Path,
    content: string,
    createdDate: Date,
    private _size?: number,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
    this._content = content;
  }

  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
    // Clear cached size when content changes to force recalculation
    this._size = undefined;
  }

  get name(): string {
    return this.id.split("/").pop() || "";
  }

  get extension(): string {
    const { name } = this;
    const lastDotIndex = name.lastIndexOf(".");
    return lastDotIndex !== -1 ? name.slice(lastDotIndex + 1) : "";
  }

  get nameWithoutExtension(): string {
    const { name } = this;
    const lastDotIndex = name.lastIndexOf(".");
    return lastDotIndex !== -1 ? name.slice(0, lastDotIndex) : name;
  }

  get directory(): string {
    return this.id.split("/").slice(0, -1).join("/");
  }

  get fullPath(): string {
    return this.id;
  }

  get size(): number {
    if (this._size) return this._size;
    return this._content.length * 2; // Assuming each character is 2 bytes (UTF-16 encoding)
  }

  get isDirectory(): boolean {
    return false;
  }

  get isFile(): boolean {
    return true;
  }
}
