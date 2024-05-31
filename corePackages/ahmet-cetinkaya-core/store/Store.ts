import type { IStore } from './abstraction/IStore';

export class Store<TValue> implements IStore<TValue> {
  protected _listeners: ((value: TValue) => void)[] = [];

  constructor(protected _value: TValue) {}

  get() {
    return this._value;
  }

  set(value: TValue) {
    this._value = value;
    for (const listener of this._listeners) listener(this.get());
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
