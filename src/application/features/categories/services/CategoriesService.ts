import { PaginationResult } from '~/core/acore-ts/repository/PaginationResult';
import CategoriesData from '~/content/categories';
import type { Category } from '~/domain/models/Category';
import type { ICategoriesService } from '../../categories/services/abstraction/ICategoriesService';

export class CategoriesService implements ICategoriesService {
  private _data: Category[] | undefined;

  public async getAll(predicate?: ((x: Category) => boolean) | undefined): Promise<Category[]> {
    if (!this._data) await this.getData();

    return Promise.resolve(predicate ? this._data!.filter(predicate) : this._data!);
  }

  public async getList(
    pageIndex: number,
    pageSize: number,
    predicate?: ((x: Category) => boolean) | undefined,
  ): Promise<PaginationResult<Category>> {
    if (!this._data) this.getData();

    let query = this._data!;
    if (predicate) query = query.filter(predicate);

    const totalItems = query.length;
    const items = query.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    return new PaginationResult<Category>(pageIndex, pageSize, items, totalItems);
  }

  private async getData(): Promise<Category[]> {
    this._data = CategoriesData;
    return this._data;
  }
}
