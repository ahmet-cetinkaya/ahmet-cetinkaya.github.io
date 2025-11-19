import Entity from "@packages/acore-ts/domain/abstraction/Entity";

type FileId = Path;
export type Path = string;

export default class File extends Entity<FileId> {
  constructor(
    id: Path,
    public content: string,
    createdDate: Date,
    private _size?: number,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }

  get name(): string {
    return this.id.split("/").pop() || "";
  }

  get extension(): string {
    const name = this.name;
    const lastDotIndex = name.lastIndexOf(".");
    return lastDotIndex !== -1 ? name.slice(lastDotIndex + 1) : "";
  }

  get nameWithoutExtension(): string {
    const name = this.name;
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
    return this.content.length * 2; // Assuming each character is 2 bytes (UTF-16 encoding)
  }
}
