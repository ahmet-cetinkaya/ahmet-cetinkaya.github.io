import EducationsData from "@domain/data/Educations";
import type Education from "@domain/models/Education";
import PaginationResult from "@packages/acore-ts/repository/PaginationResult";
import type IEducationsService from "./abstraction/IEducationsService";

export default class EducationsService implements IEducationsService {
  private data?: Education[];

  private async ensureDataLoaded(): Promise<void> {
    if (!this.data) this.data = EducationsData;
  }

  async getAll(predicate?: (x: Education) => boolean): Promise<Education[]> {
    await this.ensureDataLoaded();

    return predicate ? this.data!.filter(predicate) : this.data!;
  }

  async getList(
    pageIndex: number,
    pageSize: number,
    predicate?: (x: Education) => boolean,
  ): Promise<PaginationResult<Education>> {
    await this.ensureDataLoaded();

    const query = predicate ? this.data!.filter(predicate) : this.data!;
    const totalItems = query.length;
    const items = query.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    return new PaginationResult<Education>(pageIndex, pageSize, items, totalItems);
  }
}
