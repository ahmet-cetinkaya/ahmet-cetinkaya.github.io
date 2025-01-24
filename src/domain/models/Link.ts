import Entity from "~/core/acore-ts/domain/abstraction/Entity";
import type Icons from "../data/Icons";
import type { TranslationKey } from "../data/Translations";

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
