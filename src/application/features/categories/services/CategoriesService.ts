import PaginationResult from "~/core/acore-ts/repository/PaginationResult";
import CategoriesData from "~/domain/data/Categories";
import type Category from "~/domain/models/Category";
import type ICategoriesService from "../../categories/services/abstraction/ICategoriesService";

export default class CategoriesService implements ICategoriesService {
  private data?: Category[];

  private async ensureDataLoaded(): Promise<void> {
    if (!this.data) this.data = CategoriesData;
  }

  async getAll(predicate?: (x: Category) => boolean): Promise<Category[]> {
    await this.ensureDataLoaded();
    return predicate ? this.data!.filter(predicate) : this.data!;
  }

  async getList(
    pageIndex: number,
    pageSize: number,
    predicate?: (x: Category) => boolean,
  ): Promise<PaginationResult<Category>> {
    await this.ensureDataLoaded();

    const query = predicate ? this.data!.filter(predicate) : this.data!;
    const totalItems = query.length;
    const items = query.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    return new PaginationResult<Category>(pageIndex, pageSize, items, totalItems);
  }
}
