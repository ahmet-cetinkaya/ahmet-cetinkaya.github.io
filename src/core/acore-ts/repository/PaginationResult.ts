export default class PaginationResult<T> {
  constructor(
    public readonly pageIndex: number,
    public readonly pageSize: number,
    public readonly items: T[],
    public readonly totalItems: number,
  ) {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.items = items;
    this.totalItems = totalItems;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get hasNextPage(): boolean {
    return this.pageIndex * this.pageSize < this.totalItems;
  }

  get hasPreviousPage(): boolean {
    return this.pageIndex > 1;
  }
}
