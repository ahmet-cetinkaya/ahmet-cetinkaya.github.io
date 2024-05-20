import { useEffect, useState } from 'react';
import type { StoreBase } from './abstraction/StoreBase';
import { ReactStoreBase } from './abstraction/ReactStoreBase';

export class ReactStore extends ReactStoreBase {
  useStore<TValue>(store: StoreBase<TValue>): TValue {
    const [value, setValue] = useState<TValue>(store.get());

    useEffect(() => {
      const listener = (newValue: TValue) => {
        setValue(newValue);
      };
      store.subscribe(listener);

      return () => {
        store.unSubscribe(listener);
      };
    }, [store]);

    return value;
  }
}
