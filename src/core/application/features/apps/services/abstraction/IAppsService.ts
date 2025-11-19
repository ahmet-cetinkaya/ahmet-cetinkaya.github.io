import type App from "@domain/models/App";
import type { IGettable, IListable } from "@packages/acore-ts/repository/abstraction/IRepository";

export default interface IAppsService extends IListable<App>, IGettable<App> {}
