import { Entity } from '~/core/acore-ts/domain/abstraction/Entity';

export type TechnologyId = number;

export class Technology extends Entity<TechnologyId> {
  constructor(
    id: TechnologyId,
    public name: string,
    public icon: string,
    public linkedTechnologyIds: TechnologyId[],
    createdDate: Date,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
