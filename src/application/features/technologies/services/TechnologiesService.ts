import type { PaginationResult } from "~/core/acore-ts/repository/PaginationResult";
import { TechnologiesData } from "~/domain/data/Technologies";
import type { Technology } from "~/domain/models/Technology";
import type { ITechnologiesService } from "./abstraction/ITechnologiesService";

export default class TechnologiesService implements ITechnologiesService {
  private _data = TechnologiesData;

  getAll(predicate?: ((x: Technology) => boolean) | undefined): Promise<Technology[]> {
    let query = this._data;
    if (predicate) query = query.filter(predicate);

    return Promise.resolve(query);
  }

  getList(
    pageIndex: number,
    pageSize: number,
    predicate?: ((x: Technology) => boolean) | undefined,
  ): Promise<PaginationResult<Technology>> {
    let query = this._data;
    if (predicate) query = query.filter(predicate);

    const result = query.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

    return Promise.resolve({
      items: result,
      pageIndex,
      pageSize,
      totalItems: query.length,
      totalPages: Math.ceil(query.length / pageSize),
      hasNextPage: pageIndex < Math.ceil(query.length / pageSize),
      hasPreviousPage: pageIndex > 1,
    });
  }
}
