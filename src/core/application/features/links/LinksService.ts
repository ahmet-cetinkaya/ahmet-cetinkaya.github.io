import DataService from "@application/shared/DataService";
import LinksData from "@domain/data/Links";
import type Link from "@domain/models/Link";
import type ILinksService from "./abstraction/ILinksService";

export default class LinksService extends DataService<Link> implements ILinksService {
  protected loadData(): Link[] {
    return LinksData;
  }
}
