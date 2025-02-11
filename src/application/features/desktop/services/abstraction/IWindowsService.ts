import type { IObservable } from "~/core/acore-ts/async/abstraction/IObservable";
import type {
  IAddable,
  IGettable,
  IListable,
  IRemovable,
  IUpdatable,
} from "~/core/acore-ts/repository/abstraction/IRepository";
import type Window from "~/domain/models/Window";

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
