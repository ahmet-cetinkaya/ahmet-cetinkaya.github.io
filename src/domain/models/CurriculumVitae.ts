import { Entity } from '~/core/acore-ts/domain/abstraction/Entity';
import type { Organization, OrganizationId } from './Organization';

export type CurriculumVitaeId = number;

export class CurriculumVitae extends Entity<CurriculumVitaeId> {
  constructor(
    id: CurriculumVitaeId,
    public organizationId: OrganizationId,
    public role: string,
    public startDate: Date,
    public endDate: Date,
    public description: string,
    public body: string,
    createdDate: Date,
    updatedDate?: Date,
    public organization?: Organization,
  ) {
    super(id, createdDate, updatedDate);
  }
}
