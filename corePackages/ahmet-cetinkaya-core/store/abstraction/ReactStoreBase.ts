import type { StoreBase } from './StoreBase';

export abstract class ReactStoreBase {
  abstract useStore<TValue>(store: StoreBase<TValue>): TValue;
}
