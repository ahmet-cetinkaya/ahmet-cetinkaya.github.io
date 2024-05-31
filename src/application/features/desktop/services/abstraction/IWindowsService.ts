import type { IObservable } from '@corePackages/ahmet-cetinkaya-core/async/abstraction/IObservable';
import type {
  IAddable,
  IGettable,
  IRemovable,
  IUpdatable,
} from '@corePackages/ahmet-cetinkaya-core/repository/abstraction/IRepository';
import type { Window, WindowId } from '~/domain/models/Window';

export interface IWindowsService
  extends IAddable<Window>,
    IGettable<Window>,
    IObservable<Window[]>,
    IUpdatable<Window>,
    IRemovable<Window> {
  active(id: WindowId): Promise<void>;
  minimize(id: WindowId): Promise<void>;
  isActivated(window: Window): boolean;
  getActivated(): Window | null;
}
