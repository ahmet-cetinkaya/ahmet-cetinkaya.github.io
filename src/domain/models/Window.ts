import { Entity } from '@corePackages/ahmet-cetinkaya-core/domain/abstraction/Entity';
import type { AppId } from './App';

export type WindowId = string;

export class Window extends Entity<WindowId> {
  constructor(
    id: WindowId,
    public appId: AppId,
    public title: string,
    public layer: number | null,
    public isMinimized: boolean,
    createdDate: Date,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
