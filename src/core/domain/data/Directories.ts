import Directory from "@domain/models/Directory";

export enum Paths {
  HOME = "/home",
  ROOT = "/",
  USER_DESKTOP = "/home/ac/Desktop",
  USER_DOCUMENTS = "/home/ac/Documents",
  USER_DOWNLOADS = "/home/ac/Downloads",
  USER_GAMES = "/home/ac/Games",
  USER_HOME = "/home/ac",
  USER_LIBRARIES = "/home/ac/Libraries",
  USER_MUSIC = "/home/ac/Music",
  USER_PICTURES = "/home/ac/Pictures",
  USER_VIDEOS = "/home/ac/Videos",
}

const DATE_USER_HOME = new Date("2024-12-24 12:49:08");
const DATE_HOME = new Date("2024-12-24 12:49:08");
const DATE_USER_FOLDERS = new Date("2024-12-24 12:49:08");
const DATE_CACHE_CONFIG = new Date("2024-12-24 12:49:08");
const DATE_CODE = new Date("2025-11-19 17:18:43");
const DATE_DRACO = new Date("2024-12-25 02:42:08");
const DATE_ROOT = new Date("2022-08-11 17:22:15");
const DATE_SYSTEM = new Date("2022-08-11 17:22:15");

const DirectoryData: Directory[] = [
  new Directory(Paths.ROOT, DATE_ROOT, DATE_ROOT),

  new Directory("/bin", DATE_SYSTEM),
  new Directory("/dev", DATE_SYSTEM),
  new Directory("/etc", DATE_SYSTEM),

  new Directory(Paths.HOME, DATE_HOME),

  new Directory(Paths.USER_HOME, DATE_USER_HOME),
  new Directory(`${Paths.USER_HOME}/.cache`, DATE_CACHE_CONFIG, DATE_CACHE_CONFIG),
  new Directory(`${Paths.USER_HOME}/.config`, DATE_CACHE_CONFIG, DATE_CACHE_CONFIG),
  new Directory(`${Paths.USER_HOME}/.local`, DATE_CACHE_CONFIG, DATE_CACHE_CONFIG),
  new Directory(`${Paths.USER_HOME}/Code`, DATE_CODE),
  new Directory(Paths.USER_DESKTOP, DATE_USER_FOLDERS, DATE_USER_FOLDERS),
  new Directory(Paths.USER_DOCUMENTS, DATE_USER_FOLDERS, DATE_USER_FOLDERS),
  new Directory(Paths.USER_DOWNLOADS, DATE_USER_FOLDERS, DATE_USER_FOLDERS),
  new Directory(Paths.USER_GAMES, DATE_USER_FOLDERS, DATE_USER_FOLDERS),
  new Directory(Paths.USER_LIBRARIES, DATE_USER_FOLDERS, DATE_USER_FOLDERS),
  new Directory(`${Paths.USER_LIBRARIES}/Draco`, DATE_DRACO, DATE_DRACO),
  new Directory(Paths.USER_MUSIC, DATE_USER_FOLDERS, DATE_USER_FOLDERS),
  new Directory(Paths.USER_PICTURES, DATE_USER_FOLDERS, DATE_USER_FOLDERS),
  new Directory(Paths.USER_VIDEOS, DATE_USER_FOLDERS, DATE_USER_FOLDERS),

  new Directory("/media", DATE_SYSTEM),
  new Directory("/mnt", DATE_SYSTEM),
  new Directory("/opt", DATE_SYSTEM),
  new Directory("/proc", DATE_SYSTEM),
  new Directory("/sys", DATE_SYSTEM),
  new Directory("/tmp", DATE_SYSTEM),
  new Directory("/usr", DATE_SYSTEM),
  new Directory("/var", DATE_SYSTEM),
];

export default DirectoryData;
