import type { IGettable, IListable } from "~/core/acore-ts/repository/abstraction/IRepository";
import type App from "~/domain/models/App";

export default interface IAppsService extends IListable<App>, IGettable<App> {}
