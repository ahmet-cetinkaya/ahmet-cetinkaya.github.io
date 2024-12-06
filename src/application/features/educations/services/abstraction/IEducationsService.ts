import type { IListable } from "~/core/acore-ts/repository/abstraction/IRepository";
import type { Education } from "~/domain/models/Education";

export type IEducationsService = IListable<Education>;
