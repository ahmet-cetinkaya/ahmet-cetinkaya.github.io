import DataService from "@application/shared/DataService";
import CertificationsData from "@domain/data/Certifications";
import type Certification from "@domain/models/Certification";
import type ICertificationsService from "./abstraction/ICertificationsService";

export default class CertificationsService extends DataService<Certification> implements ICertificationsService {
  protected loadData(): Certification[] {
    return CertificationsData;
  }
}
