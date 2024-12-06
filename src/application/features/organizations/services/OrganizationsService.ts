import type { PaginationResult } from "~/core/acore-ts/repository/PaginationResult";
import { OrganizationsData } from "~/domain/data/Organizations";
import type { Organization } from "~/domain/models/Organization";
import type { IOrganizationsService } from "./abstraction/IOrganizationsService";

export default class OrganizationsService implements IOrganizationsService {
  private _data = OrganizationsData;

  getAll(predicate?: ((x: Organization) => boolean) | undefined): Promise<Organization[]> {
    let query = this._data;
    if (predicate) query = query.filter(predicate);

    return Promise.resolve(query);
  }

  getList(
    pageIndex: number,
    pageSize: number,
    predicate?: ((x: Organization) => boolean) | undefined,
  ): Promise<PaginationResult<Organization>> {
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

  get(predicate: (x: Organization) => boolean): Promise<Organization | null> {
    const result = this._data.filter(predicate);
    return Promise.resolve(result.length > 0 ? result[0] : null);
  }
}
