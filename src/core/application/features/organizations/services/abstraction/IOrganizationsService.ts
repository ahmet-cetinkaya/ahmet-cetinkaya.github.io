import type Organization from "@domain/models/Organization";
import type { IGettable, IListable } from "@packages/acore-ts/repository/abstraction/IRepository";

export default interface IOrganizationsService extends IListable<Organization>, IGettable<Organization> {}
