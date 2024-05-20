import { Entity } from '@corePackages/ahmet-cetinkaya-core/domain/abstraction/Entity';

export type TechnologyIdType = number;

export class Technology extends Entity<TechnologyIdType> {
  name: string;
  icon: string;
  linkedTechnologyIds: TechnologyIdType[];

  constructor({ id, name, icon, linkedTechnologyIds, createdDate, updatedDate }: Technology) {
    super({ id, createdDate, updatedDate });
    this.name = name;
    this.icon = icon;
    this.linkedTechnologyIds = linkedTechnologyIds;
  }
}

export class TechnologyExtended extends Technology {
  linkedTechnologies: Technology[];

  constructor({ id, name, icon, linkedTechnologies, createdDate, updatedDate }: TechnologyExtended) {
    super({
      id,
      name,
      icon,
      linkedTechnologyIds: linkedTechnologies.map((technology) => technology.id),
      createdDate,
      updatedDate,
    });
    this.linkedTechnologies = linkedTechnologies;
  }
}
