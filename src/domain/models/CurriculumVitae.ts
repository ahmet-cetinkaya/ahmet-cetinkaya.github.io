import { Entity } from "~/core/acore-ts/domain/abstraction/Entity";
import type { TranslationKey } from "../data/Translations";
import type { Organization, OrganizationId } from "./Organization";

export type CurriculumVitaeId = number;

export class CurriculumVitae extends Entity<CurriculumVitaeId> {
  constructor(
    id: CurriculumVitaeId,
    public organizationId: OrganizationId,
    public role: TranslationKey,
    public startDate: Date,
    public endDate: Date,
    public description: TranslationKey,
    public body: TranslationKey,
    createdDate: Date,
    updatedDate?: Date,
    public organization?: Organization,
  ) {
    super(id, createdDate, updatedDate);
  }
}
