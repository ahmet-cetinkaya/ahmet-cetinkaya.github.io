import type { PaginationResult } from "~/core/acore-ts/repository/PaginationResult";
import { CertificationData } from "~/domain/data/Certifications";
import type { Certification } from "~/domain/models/Certification";
import type { ICertificationsService } from "./abstraction/ICertificationsService";

export default class CertificationsService implements ICertificationsService {
  private _data = CertificationData;

  getAll(predicate?: ((x: Certification) => boolean) | undefined): Promise<Certification[]> {
    let query = this._data;
    if (predicate) query = query.filter(predicate);

    return Promise.resolve(query);
  }

  getList(
    pageIndex: number,
    pageSize: number,
    predicate?: ((x: Certification) => boolean) | undefined,
  ): Promise<PaginationResult<Certification>> {
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
