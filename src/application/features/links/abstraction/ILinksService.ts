import type { IGettable, IListable } from "~/core/acore-ts/repository/abstraction/IRepository";
import type { Link } from "~/domain/models/Link";

export interface ILinksService extends IListable<Link>, IGettable<Link> {}
