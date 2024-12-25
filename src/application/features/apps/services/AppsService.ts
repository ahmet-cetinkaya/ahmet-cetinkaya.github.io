import PaginationResult from "~/core/acore-ts/repository/PaginationResult";
import AppsData from "~/domain/data/Apps";
import type App from "~/domain/models/App";
import type IAppsService from "./abstraction/IAppsService";

export default class AppsService implements IAppsService {
  private data?: App[];

  private async ensureDataLoaded(): Promise<void> {
    if (!this.data) this.data = AppsData;
  }

  async getAll(predicate?: (x: App) => boolean): Promise<App[]> {
    await this.ensureDataLoaded();
    return predicate ? this.data!.filter(predicate) : this.data!;
  }

  async getList(pageIndex: number, pageSize: number, predicate?: (x: App) => boolean): Promise<PaginationResult<App>> {
    await this.ensureDataLoaded();

    const query = predicate ? this.data!.filter(predicate) : this.data!;
    const totalItems = query.length;
    const items = query.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    return new PaginationResult<App>(pageIndex, pageSize, items, totalItems);
  }

  async get(predicate: (x: App) => boolean): Promise<App | null> {
    await this.ensureDataLoaded();

    return this.data!.find(predicate) ?? null;
  }
}
