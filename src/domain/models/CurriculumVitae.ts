import { Entity } from '@corePackages/ahmet-cetinkaya-core/domain/abstraction/Entity';
import type { Organization, OrganizationIdType } from './Organization';

export type CurriculumVitaeIdType = number;

export class CurriculumVitae extends Entity<CurriculumVitaeIdType> {
  organizationId: OrganizationIdType;
  role: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  body: string;

  constructor({
    id,
    organizationId,
    role,
    startDate,
    endDate,
    description,
    body,
    createdDate,
    updatedDate,
  }: CurriculumVitae) {
    super({ id, createdDate, updatedDate });
    this.organizationId = organizationId;
    this.role = role;
    this.startDate = startDate;
    this.endDate = endDate;
    this.description = description;
    this.body = body;
  }
}

export class CurriculumVitaeExtended extends CurriculumVitae {
  organization: Organization;

  constructor({
    id,
    organization,
    role,
    startDate,
    endDate,
    description,
    body,
    createdDate,
    updatedDate,
  }: CurriculumVitaeExtended) {
    super({
      id,
      organizationId: organization.id,
      role,
      startDate,
      endDate,
      description,
      body,
      createdDate,
      updatedDate,
    });
    this.organization = organization;
  }
}
