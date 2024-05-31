import { PaginationResult } from '@corePackages/ahmet-cetinkaya-core/repository/PaginationResult';
import AppsData from '~/content/apps';
import type { App } from '~/domain/models/App';
import type { IAppsService } from './abstraction/IAppsService';

export class AppsService implements IAppsService {
  private _data: App[] | undefined;

  public async getAll(predicate?: ((x: App) => boolean) | undefined): Promise<App[]> {
    if (!this._data) await this.getData();

    return Promise.resolve(predicate ? this._data!.filter(predicate) : this._data!);
  }

  public async getList(
    pageIndex: number,
    pageSize: number,
    predicate?: ((x: App) => boolean) | undefined,
  ): Promise<PaginationResult<App>> {
    if (!this._data) await this.getData();

    let query = this._data!;
    if (predicate) query = query.filter(predicate);

    const totalItems = query.length;
    const items = query.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    return new PaginationResult<App>(pageIndex, pageSize, items, totalItems);
  }

  public async get(predicate: (x: App) => boolean): Promise<App> {
    if (!this._data) await this.getData();

    const item = this._data!.find(predicate);
    if (!item) throw new Error('Item not found');

    return item;
  }

  private async getData(): Promise<App[]> {
    this._data = AppsData;
    return this._data;
  }
}
