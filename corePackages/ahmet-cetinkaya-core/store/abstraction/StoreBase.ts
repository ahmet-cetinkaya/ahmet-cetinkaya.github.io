export abstract class StoreBase<TValue> {
  abstract get(): TValue;
  abstract set(value: TValue): void;
  abstract subscribe(listener: (value: TValue) => void): void;
  abstract unSubscribe(listener: (value: TValue) => void): void;
  abstract clearListeners(): void;
}
