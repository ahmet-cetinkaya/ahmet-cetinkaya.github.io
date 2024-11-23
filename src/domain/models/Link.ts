import { Entity } from "~/core/acore-ts/domain/abstraction/Entity";
import type { IconId } from "../data/Icons";
import type { TranslationKey } from "../data/Translations";

export type LinkId = number;

export class Link extends Entity<LinkId> {
  constructor(
    id: LinkId,
    public name: TranslationKey,
    public url: string,
    public icon: IconId,
    createdDate: Date,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
