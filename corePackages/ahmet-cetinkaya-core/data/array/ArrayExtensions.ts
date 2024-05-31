export enum SortOrder {
  Ascending,
  Descending,
}

export class ArrayExtensions {
  /**
   * Sorts the array by the given key.
   * @param array The array to sort.
   * @param key The key to sort by.
   * @param order The order of the sort.
   * @returns The sorted new array reference.
   */
  static sortBy<T>(array: T[], selector: (x: T) => T, order: SortOrder = SortOrder.Ascending): T[] {
    return [...array].sort((a, b) => {
      if (selector(a) < selector(b)) return order === SortOrder.Ascending ? -1 : 1;
      if (selector(a) > selector(b)) return order === SortOrder.Ascending ? 1 : -1;
      return 0;
    });
  }

  static maxBy<T>(array: T[], selector: (x: T) => number): T | undefined {
    return array.reduce((prev, current) => (selector(prev) > selector(current) ? prev : current), array[0]);
  }

  static max<T>(array: T[], selector: (x: T) => number): number {
    return Math.max(...array.map(selector));
  }
}
