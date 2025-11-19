import type Icons from "@domain/data/Icons";
import type { TranslationKey } from "@domain/data/Translations";
import Entity from "@packages/acore-ts/domain/abstraction/Entity";

export type LinkId = number;

export default class Link extends Entity<LinkId> {
  constructor(
    id: LinkId,
    public name: TranslationKey,
    public url: string,
    public icon: Icons,
    createdDate: Date,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
