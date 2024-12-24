export enum SortOrder {
  Ascending,
  Descending,
}

export default class ArrayExtensions {
  /**
   * Sorts the array by the given key.
   * @param array The array to sort.
   * @param key The key to sort by.
   * @param order The order of the sort.
   * @returns The sorted new array reference.
   */
  static sortBy<T>(
    array: T[],
    selector: (x: T) => number | boolean | string,
    order: SortOrder = SortOrder.Ascending,
  ): T[] {
    return [...array].sort((a, b) => {
      if (selector(a) < selector(b)) return order === SortOrder.Ascending ? -1 : 1;
      if (selector(a) > selector(b)) return order === SortOrder.Ascending ? 1 : -1;
      return 0;
    });
  }

  /**
   * Finds the element with the maximum value according to the selector function.
   * @param array The array to search.
   * @param selector A function that returns a number value for each element.
   * @returns The element with the maximum value, or undefined if array is empty.
   */
  static maxBy<T>(array: T[], selector: (x: T) => number): T | undefined {
    return array.reduce((prev, current) => (selector(prev) > selector(current) ? prev : current), array[0]);
  }

  /**
   * Gets the maximum value from an array using a selector function.
   * @param array The array to search.
   * @param selector A function that returns a number value for each element.
   * @returns The maximum value found in the array.
   */
  static max<T>(array: T[], selector: (x: T) => number): number {
    return Math.max(...array.map(selector));
  }

  /**
   * Finds the element with the minimum value according to the selector function.
   * @param array The array to search.
   * @param selector A function that returns a number value for each element.
   * @returns The element with the minimum value, or undefined if array is empty.
   */
  static minBy<T>(array: T[], selector: (x: T) => number): T | undefined {
    return array.reduce((prev, current) => (selector(prev) < selector(current) ? prev : current), array[0]);
  }

  /**
   * Gets the minimum value from an array using a selector function.
   * @param array The array to search.
   * @param selector A function that returns a number value for each element.
   * @returns The minimum value found in the array.
   */
  static min<T>(array: T[], selector: (x: T) => number): number {
    return Math.min(...array.map(selector));
  }

  /**
   * Removes duplicate values from the array.
   * @param array The array to remove duplicates from.
   * @param selector An optional function to select a key for each element.
   * @returns A new array with duplicates removed.
   */
  static distinct<T, U>(array: T[], selector?: (x: T) => U): T[] {
    const seen = new Set<U>();
    return array.filter((item) => {
      const key = selector ? selector(item) : (item as unknown as U);
      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }

  /**
   * Groups array elements by a key selector function.
   * @param array The array to group.
   * @param selector Function to select the grouping key.
   * @returns An object with groups as key-value pairs.
   */
  static groupBy<T, K extends string | number>(array: T[], selector: (item: T) => K): Record<K, T[]> {
    return array.reduce(
      (groups, item) => {
        const key = selector(item);
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
      },
      {} as Record<K, T[]>,
    );
  }

  /**
   * Calculates the sum of values selected from array elements.
   * @param array The array to sum.
   * @param selector Function to select the numeric value.
   * @returns The sum of all selected values.
   */
  static sum<T>(array: T[], selector: (item: T) => number): number {
    return array.reduce((sum, item) => sum + selector(item), 0);
  }

  /**
   * Calculates the average of values selected from array elements.
   * @param array The array to average.
   * @param selector Function to select the numeric value.
   * @returns The average value or 0 if array is empty.
   */
  static average<T>(array: T[], selector: (item: T) => number): number {
    if (array.length === 0) return 0;
    return this.sum(array, selector) / array.length;
  }

  /**
   * Returns the first element that satisfies the predicate or undefined.
   * @param array The array to search.
   * @param predicate Optional function to test elements.
   * @returns The first matching element or undefined.
   */
  static first<T>(array: T[], predicate?: (item: T) => boolean): T | undefined {
    return predicate ? array.find(predicate) : array[0];
  }

  /**
   * Returns the last element that satisfies the predicate or undefined.
   * @param array The array to search.
   * @param predicate Optional function to test elements.
   * @returns The last matching element or undefined.
   */
  static last<T>(array: T[], predicate?: (item: T) => boolean): T | undefined {
    if (predicate) {
      for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i])) return array[i];
      }
      return undefined;
    }
    return array[array.length - 1];
  }

  /**
   * Splits array into chunks of specified size.
   * @param array The array to chunk.
   * @param size The size of each chunk.
   * @returns new array with chunks.
   */
  static chunk<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, i * size + size));
  }
}
