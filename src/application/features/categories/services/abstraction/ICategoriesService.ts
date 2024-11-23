import type { IListable } from "~/core/acore-ts/repository/abstraction/IRepository";
import type { Category } from "~/domain/models/Category";

export interface ICategoriesService extends IListable<Category> {}
