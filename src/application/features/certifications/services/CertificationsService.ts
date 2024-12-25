import PaginationResult from "~/core/acore-ts/repository/PaginationResult";
import CertificationsData from "~/domain/data/Certifications";
import type Certification from "~/domain/models/Certification";
import type ICertificationsService from "./abstraction/ICertificationsService";

export default class CertificationsService implements ICertificationsService {
  private data?: Certification[];

  private async ensureDataLoaded(): Promise<void> {
    if (!this.data) this.data = CertificationsData;
  }

  async getAll(predicate?: (x: Certification) => boolean): Promise<Certification[]> {
    await this.ensureDataLoaded();
    return predicate ? this.data!.filter(predicate) : this.data!;
  }

  async getList(
    pageIndex: number,
    pageSize: number,
    predicate?: (x: Certification) => boolean,
  ): Promise<PaginationResult<Certification>> {
    await this.ensureDataLoaded();

    const query = predicate ? this.data!.filter(predicate) : this.data!;
    const totalItems = query.length;
    const items = query.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    return new PaginationResult<Certification>(pageIndex, pageSize, items, totalItems);
  }
}
