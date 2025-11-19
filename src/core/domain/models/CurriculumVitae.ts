import type { TranslationKey } from "@domain/data/Translations";
import Entity from "@packages/acore-ts/domain/abstraction/Entity";
import type { OrganizationId } from "./Organization";

export type CurriculumVitaeId = number;

export default class CurriculumVitae extends Entity<CurriculumVitaeId> {
  constructor(
    id: CurriculumVitaeId,
    public organizationId: OrganizationId,
    public role: TranslationKey,
    public startDate: Date,
    public endDate: Date,
    createdDate: Date,
    public descriptionMarkdown?: TranslationKey,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
