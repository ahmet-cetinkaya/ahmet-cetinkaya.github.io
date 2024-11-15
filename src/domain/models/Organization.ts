import { Entity } from '~/core/acore-ts/domain/abstraction/Entity';

export type OrganizationId = number;

export class Organization extends Entity<OrganizationId> {
  constructor(
    id: OrganizationId,
    public name: string,
    public logoUrl: string,
    public description: string,
    public location: string,
    public websiteUrl: string,
    createdDate: Date,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
