import PaginationResult from "@packages/acore-ts/repository/PaginationResult";

export default abstract class DataService<T> {
  protected data?: T[];

  protected abstract loadData(): T[];

  protected async ensureDataLoaded(): Promise<void> {
    if (!this.data) this.data = this.loadData();
  }

  async getAll(predicate?: (x: T) => boolean): Promise<T[]> {
    await this.ensureDataLoaded();
    return predicate ? this.data!.filter(predicate) : this.data!;
  }

  async getList(pageIndex: number, pageSize: number, predicate?: (x: T) => boolean): Promise<PaginationResult<T>> {
    await this.ensureDataLoaded();
    const query = predicate ? this.data!.filter(predicate) : this.data!;
    const totalItems = query.length;
    const items = query.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    return new PaginationResult<T>(pageIndex, pageSize, items, totalItems);
  }

  async get(predicate: (x: T) => boolean): Promise<T | null> {
    await this.ensureDataLoaded();
    return this.data!.find(predicate) ?? null;
  }
}
