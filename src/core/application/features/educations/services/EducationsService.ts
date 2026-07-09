import DataService from "@application/shared/DataService";
import EducationsData from "@domain/data/Educations";
import type Education from "@domain/models/Education";
import type IEducationsService from "./abstraction/IEducationsService";

export default class EducationsService extends DataService<Education> implements IEducationsService {
  protected loadData(): Education[] {
    return EducationsData;
  }
}
