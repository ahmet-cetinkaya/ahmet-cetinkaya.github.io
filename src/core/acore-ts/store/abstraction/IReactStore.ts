import type { IStore } from './IStore';

export interface IReactStore {
  useStore<TValue>(store: IStore<TValue>): TValue;
}
