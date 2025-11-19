import type Icons from "@domain/data/Icons";
import type { TranslationKey } from "@domain/data/Translations";
import Entity from "@packages/acore-ts/domain/abstraction/Entity";

export type OrganizationId = number;

export default class Organization extends Entity<OrganizationId> {
  constructor(
    id: OrganizationId,
    public name: TranslationKey,
    public icon: Icons,
    public location: string,
    public websiteUrl: string,
    createdDate: Date,
    public description?: TranslationKey,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
