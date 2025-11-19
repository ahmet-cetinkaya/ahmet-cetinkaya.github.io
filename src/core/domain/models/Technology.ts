import type Icons from "@domain/data/Icons";
import Entity from "@packages/acore-ts/domain/abstraction/Entity";

export type TechnologyId = number;

export default class Technology extends Entity<TechnologyId> {
  constructor(
    id: TechnologyId,
    public name: string,
    public icon: Icons,
    public linkedTechnologyIds: TechnologyId[] | null,
    createdDate: Date,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
