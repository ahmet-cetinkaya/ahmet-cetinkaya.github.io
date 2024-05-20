import { Entity } from '@corePackages/ahmet-cetinkaya-core/domain/abstraction/Entity';

export type OrganizationIdType = number;

export class Organization extends Entity<OrganizationIdType> {
  name: string;
  logoUrl: string;
  description: string;
  location: string;
  websiteUrl: string;

  constructor({ id, name, logoUrl, description, location, websiteUrl, createdDate, updatedDate }: Organization) {
    super({ id, createdDate, updatedDate });
    this.name = name;
    this.logoUrl = logoUrl;
    this.description = description;
    this.location = location;
    this.websiteUrl = websiteUrl;
  }
}
