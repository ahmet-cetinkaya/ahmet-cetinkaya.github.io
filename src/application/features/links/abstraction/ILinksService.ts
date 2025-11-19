import type Link from "@domain/models/Link";
import type { IGettable, IListable } from "@packages/acore-ts/repository/abstraction/IRepository";

export default interface ILinksService extends IListable<Link>, IGettable<Link> {}
