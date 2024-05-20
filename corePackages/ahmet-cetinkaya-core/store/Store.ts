import { StoreBase } from './abstraction/StoreBase';

export class Store<TValue> extends StoreBase<TValue> {
  protected _listeners: ((value: TValue) => void)[] = [];

  constructor(protected _value: TValue) {
    super();
  }

  get() {
    return this._value;
  }

  set(value: TValue) {
    this._value = value;
    this._listeners.forEach((listener) => listener(value));
  }

  subscribe(listener: (value: TValue) => void) {
    this._listeners.push(listener);
  }

  unSubscribe(listener: (value: TValue) => void) {
    const index = this._listeners.indexOf(listener);
    if (index !== -1) this._listeners.splice(index, 1);
  }

  clearListeners() {
    this._listeners = [];
  }
}
