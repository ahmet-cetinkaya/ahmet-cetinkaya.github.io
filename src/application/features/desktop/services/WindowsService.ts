import { ArrayExtensions } from '@corePackages/ahmet-cetinkaya-core/data/array/ArrayExtensions';
import { Store } from '@corePackages/ahmet-cetinkaya-core/store/Store';
import type { IStore } from '@corePackages/ahmet-cetinkaya-core/store/abstraction/IStore';
import type { Window, WindowId } from '~/domain/models/Window';
import type { IWindowsService } from './abstraction/IWindowsService';

export class WindowsService implements IWindowsService {
  private readonly _windowsStore: IStore<Window[]> = new Store<Window[]>([]);

  add(windowToAdd: Window): Promise<void> {
    const windows = this._windowsStore.get();

    windowToAdd.layer = 0;
    if (windows.length > 0) windowToAdd.layer = windows.filter((w) => !w.isMinimized).length;
    windowToAdd.createdDate = new Date();
    windows.push(windowToAdd);
    this._windowsStore.set(windows);

    return Promise.resolve();
  }

  get(predicate: (w: Window) => boolean): Promise<Window | null> {
    const window = this._windowsStore.get().find(predicate);
    return Promise.resolve(window ?? null);
  }

  subscribe(listener: (value: Window[]) => void): void {
    this._windowsStore.subscribe(listener);
    listener(this._windowsStore.get());
  }

  unSubscribe(listener: (value: Window[]) => void): void {
    this._windowsStore.unSubscribe(listener);
  }

  update(windowToUpdate: Window): Promise<void> {
    const windows = this._windowsStore.get();
    if (windows.findIndex((w) => w.id === windowToUpdate.id) < 0) return Promise.reject('Window not found.');

    windowToUpdate.updatedDate = new Date();
    this._windowsStore.set(windows);

    return Promise.resolve();
  }

  remove(predicate: (x: Window) => boolean): Promise<void> {
    this._windowsStore.set(this._windowsStore.get().filter((x) => !predicate(x)));

    return Promise.resolve();
  }

  active(id: WindowId): Promise<void> {
    const windows = this._windowsStore.get();
    const windowIndexToActive = windows.findIndex((w) => w.id === id);
    if (!window) return Promise.reject('Window not found.');
    const windowToActive = windows[windowIndexToActive];
    if (windowToActive.layer === windows.length) return Promise.resolve();

    for (let i = 0; i < windows.length; ++i) {
      if (i === windowIndexToActive) continue;
      if (windows[i].isMinimized) continue;
      if (windows[i].layer! < windowToActive.layer!) continue;

      windows[i].layer = windows[i].layer! - 1;
      windows[i].updatedDate = new Date();
    }
    windowToActive.layer = windows.length - 1;
    if (windowToActive.isMinimized) windowToActive.isMinimized = false;
    windowToActive.updatedDate = new Date();
    this._windowsStore.set(windows);

    return Promise.resolve();
  }

  minimize(id: WindowId): Promise<void> {
    const windows = this._windowsStore.get();
    const windowToMinimize = windows.find((w) => w.id === id);
    if (!windowToMinimize) return Promise.reject('Window not found.');

    windowToMinimize.isMinimized = true;
    windowToMinimize.layer = null;
    windowToMinimize.updatedDate = new Date();

    this._windowsStore.set(windows);

    return Promise.resolve();
  }

  isActivated(window: Window): boolean {
    if (window.isMinimized) return false;
    if (window.layer === null) return false;

    const activeWindowLayer = ArrayExtensions.max(this._windowsStore.get(), (w) => w.layer!);
    return window.layer === activeWindowLayer;
  }

  getActivated(): Window | null {
    const windows = this._windowsStore.get();
    if (windows.length === 0) return null;
    if (windows.some((w) => !w.isMinimized)) return null;

    return ArrayExtensions.maxBy(windows, (w) => w.layer!)!;
  }
}
