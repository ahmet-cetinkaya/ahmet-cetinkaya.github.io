import { Entity } from '@corePackages/ahmet-cetinkaya-core/domain/abstraction/Entity';
import type { Icon } from '~/domain/constants/Icons';

export type LinkIdType = number;

export class Link extends Entity<LinkIdType> {
  name: string;
  url: string;
  icon: Icon;

  constructor({ id, name, url, icon, createdDate, updatedDate }: Link) {
    super({ id, createdDate, updatedDate });
    this.name = name;
    this.url = url;
    this.icon = icon;
  }
}
