import PaginationResult from "~/core/acore-ts/repository/PaginationResult";
import OrganizationsData from "~/domain/data/Organizations";
import type Organization from "~/domain/models/Organization";
import type IOrganizationsService from "./abstraction/IOrganizationsService";

export default class OrganizationsService implements IOrganizationsService {
  private data?: Organization[];

  private async ensureDataLoaded(): Promise<void> {
    if (!this.data) this.data = OrganizationsData;
  }

  async getAll(predicate?: (x: Organization) => boolean): Promise<Organization[]> {
    await this.ensureDataLoaded();
    return predicate ? this.data!.filter(predicate) : this.data!;
  }

  async getList(
    pageIndex: number,
    pageSize: number,
    predicate?: (x: Organization) => boolean,
  ): Promise<PaginationResult<Organization>> {
    await this.ensureDataLoaded();

    const query = predicate ? this.data!.filter(predicate) : this.data!;
    const totalItems = query.length;
    const items = query.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    return new PaginationResult<Organization>(pageIndex, pageSize, items, totalItems);
  }

  async get(predicate: (x: Organization) => boolean): Promise<Organization | null> {
    await this.ensureDataLoaded();

    return this.data!.find(predicate) ?? null;
  }
}
