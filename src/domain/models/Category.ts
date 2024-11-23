import { Entity } from "~/core/acore-ts/domain/abstraction/Entity";
import type { Categories } from "../data/Categories";
import type { TranslationKey } from "../data/Translations";

export type CategoryId = Categories;

export class Category extends Entity<CategoryId> {
  constructor(
    id: CategoryId,
    public name: TranslationKey,
    createdDate: Date,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
