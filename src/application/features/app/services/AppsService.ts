import { PaginationResult } from "~/core/acore-ts/repository/PaginationResult";
import { AppsData } from "~/domain/data/Apps";
import type { App } from "~/domain/models/App";
import type { IAppsService } from "./abstraction/IAppsService";

export class AppsService implements IAppsService {
  private _data: App[] = AppsData;

  async getAll(predicate?: ((x: App) => boolean) | undefined): Promise<App[]> {
    return Promise.resolve(predicate ? this._data!.filter(predicate) : this._data!);
  }

  async getList(
    pageIndex: number,
    pageSize: number,
    predicate?: ((x: App) => boolean) | undefined,
  ): Promise<PaginationResult<App>> {
    let query = this._data!;
    if (predicate) query = query.filter(predicate);

    const totalItems = query.length;
    const items = query.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    return new PaginationResult<App>(pageIndex, pageSize, items, totalItems);
  }

  async get(predicate: (x: App) => boolean): Promise<App> {
    const item = this._data!.find(predicate);
    if (!item) throw new Error("Item not found");
    return item;
  }
}
