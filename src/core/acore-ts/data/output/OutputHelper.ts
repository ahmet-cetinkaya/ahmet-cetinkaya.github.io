type ColumnDefinition<T> = {
  header: string;
  getValue: (item: T, index: number) => string;
  minWidth?: number;
};

export default class OutputHelper {
  static formatTable<T>(items: T[], columns: ColumnDefinition<T>[]): string {
    // Calculate column widths based on content
    const columnWidths = columns.map((col) => {
      const headerLength = col.header.length;
      const maxContentLength = Math.max(...items.map((item, index) => col.getValue(item, index + 1).length));
      return Math.max(headerLength, maxContentLength, col.minWidth || 0);
    });

    // Format header and lines with minimal spacing
    const formatLine = (values: string[]) => values.map((val, i) => val.padEnd(columnWidths[i])).join("  ");

    const header = formatLine(columns.map((col) => col.header));
    const rows = items.map((item, index) => formatLine(columns.map((col) => col.getValue(item, index + 1))));

    return [header, ...rows].join("\n");
  }
}
