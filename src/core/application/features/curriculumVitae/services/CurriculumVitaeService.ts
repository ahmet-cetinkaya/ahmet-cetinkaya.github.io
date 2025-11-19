import CurriculumVitaesData from "@domain/data/CurriculumVitae";
import type CurriculumVitae from "@domain/models/CurriculumVitae";
import PaginationResult from "@packages/acore-ts/repository/PaginationResult";
import type ICurriculumVitaeService from "./abstraction/ICurriculumVitaeService";

export default class CurriculumVitaeService implements ICurriculumVitaeService {
  private data?: CurriculumVitae[];

  private async ensureDataLoaded(): Promise<void> {
    if (!this.data) this.data = CurriculumVitaesData;
  }

  async getAll(predicate?: (x: CurriculumVitae) => boolean): Promise<CurriculumVitae[]> {
    await this.ensureDataLoaded();
    return predicate ? this.data!.filter(predicate) : this.data!;
  }

  async getList(
    pageIndex: number,
    pageSize: number,
    predicate?: (x: CurriculumVitae) => boolean,
  ): Promise<PaginationResult<CurriculumVitae>> {
    await this.ensureDataLoaded();

    const query = predicate ? this.data!.filter(predicate) : this.data!;
    const totalItems = query.length;
    const items = query.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    return new PaginationResult<CurriculumVitae>(pageIndex, pageSize, items, totalItems);
  }
}
