import type { IListable } from "~/core/acore-ts/repository/abstraction/IRepository";
import type CurriculumVitae from "~/domain/models/CurriculumVitae";

export default interface ICurriculumVitaeService extends IListable<CurriculumVitae> {}
