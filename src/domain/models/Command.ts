import { Entity } from '@corePackages/ahmet-cetinkaya-core/domain/abstraction/Entity';
import type { Category, CategoryId } from './Category';

export enum Commands {
  Shutdown = 1,
  Restart = 2,
}

export type CommandId = Commands;

export class Command extends Entity<CommandId> {
  constructor(
    id: CommandId,
    public categoryId: CategoryId,
    public name: string,
    public execute: () => void,
    createdDate: Date,
    updatedDate?: Date,
    public category?: Category,
  ) {
    super(id, createdDate, updatedDate);
  }
}
