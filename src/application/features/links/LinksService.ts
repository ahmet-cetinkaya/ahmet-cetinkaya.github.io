import type { PaginationResult } from "~/core/acore-ts/repository/PaginationResult";
import { LinksData } from "~/domain/data/Links";
import type { Link } from "~/domain/models/Link";
import type { ILinksService } from "./abstraction/ILinksService";

export class LinksService implements ILinksService {
  private _data = LinksData;

  getAll(predicate?: ((x: Link) => boolean) | undefined): Promise<Link[]> {
    let query = this._data;
    if (predicate) {
      query = query.filter(predicate);
    }

    return Promise.resolve(query);
  }

  getList(
    pageIndex: number,
    pageSize: number,
    predicate?: ((x: Link) => boolean) | undefined,
  ): Promise<PaginationResult<Link>> {
    let query = this._data;
    if (predicate) {
      query = query.filter(predicate);
    }

    const total = query.length;
    query = query.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

    return Promise.resolve({
      items: query,
      pageIndex,
      pageSize,
      totalItems: total,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: pageIndex * pageSize < total,
      hasPreviousPage: pageIndex > 1,
    });
  }

  get(predicate: (x: Link) => boolean): Promise<Link | null> {
    const result = this._data.find(predicate);
    return Promise.resolve(result ?? null);
  }
}
