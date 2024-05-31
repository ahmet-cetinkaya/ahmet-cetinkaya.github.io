import { Entity } from '@corePackages/ahmet-cetinkaya-core/domain/abstraction/Entity';
import type { Icon } from '~/domain/constants/Icons';
import type { Category, CategoryId } from './Category';

export enum Apps {
  AboutMe = 1,
  Contact,
  Blog,
  Shutdown,
  Restart,
}

export type AppId = Apps;

export class App extends Entity<AppId> {
  constructor(
    id: AppId,
    public categoryId: CategoryId,
    public name: string,
    public icon: Icon,
    public path: string,
    createdDate: Date,
    updatedDate?: Date,
    public category?: Category,
  ) {
    super(id, createdDate, updatedDate);
  }
}
