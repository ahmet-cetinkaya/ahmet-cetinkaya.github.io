import { Entity } from '@corePackages/ahmet-cetinkaya-core/domain/abstraction/Entity';

export enum Categories {
  System = 1,
  Apps,
  Power,
}

export type CategoryId = Categories;

export class Category extends Entity<CategoryId> {
  constructor(
    id: CategoryId,
    public name: string,
    createdDate: Date,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
