import type Education from "@domain/models/Education";
import type { IListable } from "@packages/acore-ts/repository/abstraction/IRepository";

export default interface IEducationsService extends IListable<Education> {}
