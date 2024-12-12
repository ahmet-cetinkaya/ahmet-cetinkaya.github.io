import { Entity } from "~/core/acore-ts/domain/abstraction/Entity";

export type AreaId = number;

export default class Area extends Entity<AreaId> {
  constructor(
    public id: number,
    public name: string,
    createdDate: Date,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
