import DataService from "@application/shared/DataService";
import OrganizationsData from "@domain/data/Organizations";
import type Organization from "@domain/models/Organization";
import type IOrganizationsService from "./abstraction/IOrganizationsService";

export default class OrganizationsService extends DataService<Organization> implements IOrganizationsService {
  protected loadData(): Organization[] {
    return OrganizationsData;
  }
}
