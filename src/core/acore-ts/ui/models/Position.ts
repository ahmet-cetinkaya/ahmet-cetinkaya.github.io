export class Position {
  constructor(
    public top: number,
    public left: number,
  ) {}

  equals(position: Position): boolean {
    return this.top === position.top && this.left === position.left;
  }
}
