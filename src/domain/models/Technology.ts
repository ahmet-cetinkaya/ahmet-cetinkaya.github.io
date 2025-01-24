import Entity from "~/core/acore-ts/domain/abstraction/Entity";
import type Icons from "../data/Icons";

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
