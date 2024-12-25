import PaginationResult from "~/core/acore-ts/repository/PaginationResult";
import LinksData from "~/domain/data/Links";
import type Link from "~/domain/models/Link";
import type ILinksService from "./abstraction/ILinksService";

export default class LinksService implements ILinksService {
  private data?: Link[];

  private async ensureDataLoaded(): Promise<void> {
    if (!this.data) this.data = LinksData;
  }

  async getAll(predicate?: (x: Link) => boolean): Promise<Link[]> {
    await this.ensureDataLoaded();
    return predicate ? this.data!.filter(predicate) : this.data!;
  }

  async getList(
    pageIndex: number,
    pageSize: number,
    predicate?: (x: Link) => boolean,
  ): Promise<PaginationResult<Link>> {
    await this.ensureDataLoaded();

    const query = predicate ? this.data!.filter(predicate) : this.data!;
    const totalItems = query.length;
    const items = query.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    return new PaginationResult<Link>(pageIndex, pageSize, items, totalItems);
  }

  async get(predicate: (x: Link) => boolean): Promise<Link | null> {
    await this.ensureDataLoaded();

    return this.data!.find(predicate) ?? null;
  }
}
