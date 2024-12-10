import type { IGettable, IListable } from "~/core/acore-ts/repository/abstraction/IRepository";
import type { Organization } from "~/domain/models/Organization";

export interface IOrganizationsService extends IListable<Organization>, IGettable<Organization> {}