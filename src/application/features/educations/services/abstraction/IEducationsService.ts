import type { IListable } from "~/core/acore-ts/repository/abstraction/IRepository";
import type Education from "~/domain/models/Education";

export default interface IEducationsService extends IListable<Education> {}
