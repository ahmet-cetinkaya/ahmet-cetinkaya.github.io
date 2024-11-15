import { useEffect, useState } from 'react';
import type { IReactStore } from './abstraction/IReactStore';
import type { IStore } from './abstraction/IStore';

export class ReactStore implements IReactStore {
  useStore<TValue>(store: IStore<TValue>): TValue {
    const [value, setValue] = useState<TValue>(store.get());

    useEffect(() => {
      const listener = (newValue: TValue) => {
        setValue(newValue);
      };
      store.subscribe(listener);

      return () => {
        store.unsubscribe(listener);
      };
    }, [store]);

    return value;
  }
}
