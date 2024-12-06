import type { PaginationResult } from "~/core/acore-ts/repository/PaginationResult";
import { CurriculumVitaeData } from "~/domain/data/CurriculumVitae";
import type { CurriculumVitae } from "~/domain/models/CurriculumVitae";
import type { ICurriculumVitaeService } from "./abstraction/ICurriculumVitaeService";

export default class CurriculumVitaeService implements ICurriculumVitaeService {
  private _data = CurriculumVitaeData;

  getAll(predicate?: ((x: CurriculumVitae) => boolean) | undefined): Promise<CurriculumVitae[]> {
    let query = this._data;
    if (predicate) query = query.filter(predicate);

    return Promise.resolve(query);
  }

  getList(
    pageIndex: number,
    pageSize: number,
    predicate?: ((x: CurriculumVitae) => boolean) | undefined,
  ): Promise<PaginationResult<CurriculumVitae>> {
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
