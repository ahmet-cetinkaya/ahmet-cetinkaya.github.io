import { Entity } from "~/core/acore-ts/domain/abstraction/Entity";
import type { TranslationKey } from "../data/Translations";
import type { OrganizationId } from "./Organization";

export type EducationId = number;

export class Education extends Entity<EducationId> {
  constructor(
    id: EducationId,
    public organizationId: OrganizationId,
    public department: TranslationKey,
    public startDate: Date,
    public endDate: Date,
    createdDate: Date,
    public descriptionMarkdown?: TranslationKey,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
