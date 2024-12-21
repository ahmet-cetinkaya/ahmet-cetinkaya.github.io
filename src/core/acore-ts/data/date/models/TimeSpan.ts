import Times from "../constants/Times";

export default class TimeSpan {
  private hours: number;
  private minutes: number;
  private seconds: number;

  constructor(hours: number = 0, minutes: number = 0, seconds: number = 0) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  public getTotalSeconds(): number {
    return this.hours * Times.SECONDS_IN_HOUR + this.minutes * Times.SECONDS_IN_MINUTE + this.seconds;
  }

  public toString(): string {
    return `${this.hours}h ${this.minutes}m ${this.seconds}s`;
  }
}
