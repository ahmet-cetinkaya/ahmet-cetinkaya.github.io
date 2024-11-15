export enum Time {
  MillisInSecond = 1000,
  SecondsInMinute = 60,
  MinutesInHour = SecondsInMinute,
  HoursInDay = 24,
  MillisInMinute = MillisInSecond * SecondsInMinute,
  MillisInHour = MillisInMinute * MinutesInHour,
  MillisInDay = MillisInHour * HoursInDay,
}
