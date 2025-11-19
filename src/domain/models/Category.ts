import type { Categories } from "@domain/data/Categories";
import type { TranslationKey } from "@domain/data/Translations";
import Entity from "@packages/acore-ts/domain/abstraction/Entity";

export type CategoryId = Categories;

export default class Category extends Entity<CategoryId> {
  constructor(
    id: CategoryId,
    public name: TranslationKey,
    createdDate: Date,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
