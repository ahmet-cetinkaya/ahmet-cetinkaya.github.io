import { Entity } from '~/core/acore-ts/domain/abstraction/Entity';
import type { Icon } from '~/domain/constants/Icons';

export type LinkId = number;

export class Link extends Entity<LinkId> {
  constructor(
    id: LinkId,
    public name: string,
    public url: string,
    public icon: Icon,
    createdDate: Date,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
