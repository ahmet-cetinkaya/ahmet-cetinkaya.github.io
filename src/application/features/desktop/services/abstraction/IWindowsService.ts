import type Window from "@domain/models/Window";
import type { IObservable } from "@packages/acore-ts/async/abstraction/IObservable";
import type {
  IAddable,
  IGettable,
  IListable,
  IRemovable,
  IUpdatable,
} from "@packages/acore-ts/repository/abstraction/IRepository";

export default interface IWindowsService
  extends IAddable<Window>,
    IGettable<Window>,
    IListable<Window>,
    IObservable<Window[]>,
    IUpdatable<Window>,
    IRemovable<Window> {
  active(window: Window): Promise<void>;
  minimize(window: Window): Promise<void>;
  isActivated(window: Window): boolean;
  getActivatedWindow(): Window | null;
  bulkUpdate(windows: Window[]): Promise<void>;
}
