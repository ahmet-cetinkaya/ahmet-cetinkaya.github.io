import type CurriculumVitae from "@domain/models/CurriculumVitae";
import type { IListable } from "@packages/acore-ts/repository/abstraction/IRepository";

export default interface ICurriculumVitaeService extends IListable<CurriculumVitae> {}
