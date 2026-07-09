import DataService from "@application/shared/DataService";
import CurriculumVitaesData from "@domain/data/CurriculumVitae";
import type CurriculumVitae from "@domain/models/CurriculumVitae";
import type ICurriculumVitaeService from "./abstraction/ICurriculumVitaeService";

export default class CurriculumVitaeService extends DataService<CurriculumVitae> implements ICurriculumVitaeService {
  protected loadData(): CurriculumVitae[] {
    return CurriculumVitaesData;
  }
}
