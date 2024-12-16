import { createMemo, createRoot, createSignal, onCleanup, untrack, type Accessor, type JSX } from "solid-js";

type KeyableType = string | number | symbol;

type NodeEntry<TItem> = {
  index: [Accessor<number>, (v: number) => void];
  item: [Accessor<TItem>, (v: TItem) => void];
  result: JSX.Element;
};

type KeyProps<TItem, TKey extends KeyableType> = {
  each?: TItem[];
  by: (item: TItem) => TKey;
  children: (item: Accessor<TItem>, index: Accessor<number>) => JSX.Element;
};

/**
 * A Solid.js component that maps over a list of items and renders them using a provided key function.
 *
 * @example
 * <Key each={items()} by={(item) => item.id}>
 *   {(item, index) => <div>{index()}: {item().name}</div>}
 * </Key>
 */
export default function Key<TItem, TKey extends KeyableType>(props: KeyProps<TItem, TKey>): JSX.Element {
  // Map to store cleanup functions for each key
  const disposers = new Map<TKey, () => void>();
  let previousNodeEntries = new Map<TKey, NodeEntry<TItem>>();

  onCleanup(() => {
    for (const disposer of disposers.values()) disposer();
  });

  // Memoized computation to track changes in the list
  const memoized = createMemo(() => {
    const list = props.each || [];
    const mapped: JSX.Element[] = [];
    const newNodes = new Map<TKey, NodeEntry<TItem>>();

    // Move untrack boundary to only cover the map operations
    for (let i = 0; i < list.length; i++) {
      const listItem = list[i];
      const keyValue = props.by(listItem);

      untrack(() => {
        const lookup = previousNodeEntries.get(keyValue);
        if (!lookup) {
          // Create a new node if it doesn't exist
          mapped[i] = createRoot((dispose) => {
            disposers.set(keyValue, dispose);
            const index = createSignal<number>(i);
            const item = createSignal<TItem>(listItem);
            const result = props.children(item[0], index[0]);
            newNodes.set(keyValue, { index, item, result });
            return result;
          });
        } else {
          // Update the existing node
          lookup.index[1](i);
          lookup.item[1](listItem);
          mapped[i] = lookup.result;
          newNodes.set(keyValue, lookup);
        }
      });
    }

    // Dispose of nodes that are no longer in the list
    for (const old of previousNodeEntries.keys()) {
      if (!newNodes.has(old)) disposers.get(old)!();
    }
    previousNodeEntries = newNodes;
    return mapped;
  });

  return <>{memoized()}</>;
}
