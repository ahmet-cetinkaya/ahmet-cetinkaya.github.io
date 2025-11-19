import type Category from "@domain/models/Category";
import type { IListable } from "@packages/acore-ts/repository/abstraction/IRepository";

export default interface ICategoriesService extends IListable<Category> {}
