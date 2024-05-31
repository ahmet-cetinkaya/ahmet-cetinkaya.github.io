import type { IObservable } from '../../async/abstraction/IObservable';

export interface IStore<TValue> extends IObservable<TValue> {
  get(): TValue;
  set(value: TValue): void;
  clearListeners(): void;
}
