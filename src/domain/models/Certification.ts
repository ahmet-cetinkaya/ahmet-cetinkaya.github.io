import { Entity } from "~/core/acore-ts/domain/abstraction/Entity";
import type { TranslationKey } from "../data/Translations";
import type { OrganizationId } from "./Organization";

type CertificationId = number;

export class Certification extends Entity<CertificationId> {
  constructor(
    id: CertificationId,
    public organizationId: OrganizationId,
    public name: TranslationKey,
    public date: Date,
    createdDate: Date,
    public url?: string,
    public descriptionMarkdown?: TranslationKey,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
