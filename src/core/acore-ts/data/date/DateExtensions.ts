import Times from "./constants/Times";
import TimeSpan from "./models/TimeSpan";

export default class DateExtensions {
  static getTimeDiff(createdDate: Date): TimeSpan {
    const diff = new Date().getTime() - createdDate.getTime();
    const seconds = Math.floor(diff / Times.MILLIS_IN_SECOND);
    const minutes = Math.floor(seconds / Times.SECONDS_IN_MINUTE);
    const hours = Math.floor(minutes / Times.MINUTES_IN_HOUR);
    return new TimeSpan(hours, minutes % Times.MINUTES_IN_HOUR, seconds % Times.SECONDS_IN_MINUTE);
  }

  static isPast(date: Date): boolean {
    return date.getTime() < new Date().getTime();
  }

  static isFuture(date: Date): boolean {
    return date.getTime() > new Date().getTime();
  }

  static isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  static isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  }

  static isTomorrow(date: Date): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  }

  static isWeekend(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  static isWeekday(date: Date): boolean {
    return !DateExtensions.isWeekend(date);
  }

  static isLeapYear(date: Date): boolean {
    const year = date.getFullYear();
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
}
