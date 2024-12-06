import type { PaginationResult } from "~/core/acore-ts/repository/PaginationResult";
import { EducationData } from "~/domain/data/Educations";
import type { Education } from "~/domain/models/Education";
import type { IEducationsService } from "./abstraction/IEducationsService";

export default class EducationsService implements IEducationsService {
  private _data = EducationData;

  getAll(predicate?: ((x: Education) => boolean) | undefined): Promise<Education[]> {
    let query = this._data;
    if (predicate) query = query.filter(predicate);

    return Promise.resolve(query);
  }

  getList(
    pageIndex: number,
    pageSize: number,
    predicate?: ((x: Education) => boolean) | undefined,
  ): Promise<PaginationResult<Education>> {
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
