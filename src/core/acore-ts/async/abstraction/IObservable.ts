export interface IObservable<TValue> {
  subscribe(listener: (value: TValue) => void): void;
  unsubscribe(listener: (value: TValue) => void): void;
}
