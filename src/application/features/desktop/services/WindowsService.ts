import { ArrayExtensions } from "~/core/acore-ts/data/array/ArrayExtensions";
import { Store } from "~/core/acore-ts/store/Store";
import type { IStore } from "~/core/acore-ts/store/abstraction/IStore";
import type { Window } from "~/domain/models/Window";
import type { IWindowsService } from "./abstraction/IWindowsService";

export class WindowsService implements IWindowsService {
  private readonly _windowsStore: IStore<Window[]> = new Store<Window[]>([]);

  //#region Get
  get(predicate: (w: Window) => boolean): Promise<Window | null> {
    const window = this._windowsStore.get().find(predicate);
    return Promise.resolve(window ?? null);
  }

  subscribe(listener: (value: Window[]) => void): void {
    this._windowsStore.subscribe(listener);
    listener(this._windowsStore.get());
  }

  unsubscribe(listener: (value: Window[]) => void): void {
    this._windowsStore.unsubscribe(listener);
  }
  //#endregion

  //#region CRUD
  add(window: Window): Promise<void> {
    const windows = this._windowsStore.get();

    const existsAppWindow = windows.find((w) => w.appId === window.appId);
    if (existsAppWindow) {
      this.active(existsAppWindow);
      return Promise.reject(new Error("App window already exists."));
    }

    window.layer = Math.max(ArrayExtensions.max(windows, (w) => w.layer!) + 1, 1);
    window.createdDate = new Date();
    this._windowsStore.set([...windows.map((w) => ({ ...w })), window]);

    return Promise.resolve();
  }

  update(window: Window): Promise<void> {
    const windows = this._windowsStore.get();

    const windowIndexToUpdate = windows.findIndex((w) => w.id === window.id);
    if (windowIndexToUpdate < 0) return Promise.reject("Window not found.");

    window.updatedDate = new Date();
    this._windowsStore.set([...windows.map((w) => ({ ...w }))]);

    return Promise.resolve();
  }

  remove(predicate: (x: Window) => boolean): Promise<void> {
    const windows = this._windowsStore.get().filter((x) => !predicate(x));
    this._windowsStore.set([...windows.map((w) => ({ ...w }))]);

    return Promise.resolve();
  }

  //#endregion

  //#region Helpers
  active(window: Window): Promise<void> {
    const windows = this._windowsStore.get();
    const windowIndexToActive = windows.findIndex((w) => w.id === window.id);
    if (windowIndexToActive === -1) return Promise.reject("Window not found.");
    if (this.isActivated(windows[windowIndexToActive])) return Promise.reject("Window already activated.");

    const maxLayer = Math.max(
      ArrayExtensions.max(windows, (w) => w.layer!),
      1,
    );
    for (let i = 0; i < windows.length; i++) {
      if (windows[i].isMinimized) continue;
      if (windows[i].layer! < windows[windowIndexToActive].layer!) continue;

      windows[i].layer!--;
      windows[i].updatedDate = new Date();
    }

    window.layer = maxLayer;
    window.isMinimized = false;
    window.updatedDate = new Date();
    this._windowsStore.set([...windows.map((w) => ({ ...w }))]);

    return Promise.resolve();
  }

  minimize(window: Window): Promise<void> {
    const windows = this._windowsStore.get();
    const windowIndexToMinimize = windows.findIndex((w) => w.id === window.id);
    if (windowIndexToMinimize === -1) return Promise.reject("Window not found.");

    window.layer = 0;
    window.isMinimized = true;
    window.updatedDate = new Date();
    this._windowsStore.set([...windows.map((w) => ({ ...w }))]);

    return Promise.resolve();
  }

  isActivated(window: Window): boolean {
    if (window?.isMinimized) return false;

    const activeWindowLayer = ArrayExtensions.max(this._windowsStore.get(), (w) => w.layer!);
    return window?.layer === activeWindowLayer;
  }

  getActivedWindow(): Window | null {
    const activedWindow = ArrayExtensions.maxBy(this._windowsStore.get(), (w) => w.layer!);
    if (!activedWindow) return null;

    return activedWindow;
  }
  //#endregion
}