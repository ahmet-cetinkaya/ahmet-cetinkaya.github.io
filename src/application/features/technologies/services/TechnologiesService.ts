import PaginationResult from "~/core/acore-ts/repository/PaginationResult";
import TechnologiesData from "~/domain/data/Technologies";
import type Technology from "~/domain/models/Technology";
import type ITechnologiesService from "./abstraction/ITechnologiesService";

export default class TechnologiesService implements ITechnologiesService {
  private data?: Technology[];

  private async ensureDataLoaded(): Promise<void> {
    if (!this.data) this.data = TechnologiesData;
  }

  async getAll(predicate?: (x: Technology) => boolean): Promise<Technology[]> {
    await this.ensureDataLoaded();
    return predicate ? this.data!.filter(predicate) : this.data!;
  }

  async getList(
    pageIndex: number,
    pageSize: number,
    predicate?: (x: Technology) => boolean,
  ): Promise<PaginationResult<Technology>> {
    await this.ensureDataLoaded();

    const query = predicate ? this.data!.filter(predicate) : this.data!;
    const totalItems = query.length;
    const items = query.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    return new PaginationResult<Technology>(pageIndex, pageSize, items, totalItems);
  }
}
