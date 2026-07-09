import DataService from "@application/shared/DataService";
import AppsData from "@domain/data/Apps";
import type App from "@domain/models/App";
import type IAppsService from "./abstraction/IAppsService";

export default class AppsService extends DataService<App> implements IAppsService {
  protected loadData(): App[] {
    return AppsData;
  }
}
