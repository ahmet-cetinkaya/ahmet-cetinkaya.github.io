export default class JsonExtensions {
  public static stringify(value: unknown): string {
    return JSON.stringify(value, (key, value) => {
      if (value instanceof Date) return value.toISOString();
      else if (value instanceof Function) return value.toString();
      return value;
    });
  }

  public static parse<T>(json: string): T {
    return JSON.parse(json, (key, value) => {
      if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/))
        return new Date(value);
      else if (typeof value === "string" && (value.match(/^function.*\}$/) || value.match(/^\(.*\)\s*=>\s*\{.*\}$/)))
        return new Function(`return ${value}`)();
      return value;
    }) as T;
  }
}
