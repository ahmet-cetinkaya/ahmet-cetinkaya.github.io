export interface IObservable<TValue> {
  subscribe(listener: (value: TValue) => void): void;
  unSubscribe(listener: (value: TValue) => void): void;
}
