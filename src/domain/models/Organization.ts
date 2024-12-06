import { Entity } from "~/core/acore-ts/domain/abstraction/Entity";
import type { Icons } from "../data/Icons";
import type { TranslationKey } from "../data/Translations";

export type OrganizationId = number;

export class Organization extends Entity<OrganizationId> {
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
