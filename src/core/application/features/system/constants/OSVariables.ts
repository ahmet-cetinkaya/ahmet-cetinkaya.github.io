export default class OSVariables {
  static readonly DEFAULT_TIME = "00:00:00";
  static readonly DEFAULT_USER = "ac";

  static readonly BOOT_TIME_KEY = "boot_time";
  getBootTime(): Date {
    return new Date(localStorage.getItem(OSVariables.BOOT_TIME_KEY) || new Date().toISOString());
  }
}
