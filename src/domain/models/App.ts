import { Entity } from '@corePackages/ahmet-cetinkaya-core/domain/abstraction/Entity';
import type { Icon } from '~/domain/constants/Icons';

export enum Apps {
  AboutMe = 1,
  Contact,
  Blog,
}

export type AppId = Apps;

export class App extends Entity<AppId> {
  name: string;
  icon: Icon;

  constructor({ id, createdDate, updatedDate, name, icon }: App) {
    super({ id, createdDate, updatedDate });
    this.name = name;
    this.icon = icon;
  }
}
