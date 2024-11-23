import type { IObservable } from "~/core/acore-ts/async/abstraction/IObservable";
import type { IAddable, IGettable, IRemovable, IUpdatable } from "~/core/acore-ts/repository/abstraction/IRepository";
import type { Window } from "~/domain/models/Window";

export interface IWindowsService
  extends IAddable<Window>,
    IGettable<Window>,
    IObservable<Window[]>,
    IUpdatable<Window>,
    IRemovable<Window> {
  active(window: Window): Promise<void>;
  minimize(window: Window): Promise<void>;
  isActivated(window: Window): boolean;
  getActivedWindow(): Window | null;
}
