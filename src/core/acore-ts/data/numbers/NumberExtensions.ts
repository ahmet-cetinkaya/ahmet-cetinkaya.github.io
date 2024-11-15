export default class NumberExtensions {
  static extractNumber(value: string): number {
    const matches = value.match(/\d+/);

    return matches ? Number.parseInt(matches[0], 10) : 0;
  }

  static parseMeasurement(value: string): Measurement {
    const match = value.match(/^(\d+)(\D+)$/);
    if (!match) throw new Error(`Invalid measurement: ${value}`);

    return new Measurement(Number.parseInt(match[1], 10), match[2]);
  }
}

export class Measurement {
  constructor(
    public value: number,
    public unit: string,
  ) {}
}
