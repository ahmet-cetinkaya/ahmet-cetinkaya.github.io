import Directory from "../models/Directory";

const MIN_DATE = new Date(0);

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

const DirectoryData: Directory[] = [
  new Directory(Paths.ROOT, MIN_DATE),

  new Directory("/bin", MIN_DATE),
  new Directory("/dev", MIN_DATE),
  new Directory("/etc", MIN_DATE),

  new Directory(Paths.HOME, MIN_DATE),

  new Directory(Paths.USER_HOME, MIN_DATE),
  new Directory(`${Paths.USER_HOME}/.cache`, MIN_DATE),
  new Directory(`${Paths.USER_HOME}/.config`, MIN_DATE),
  new Directory(`${Paths.USER_HOME}/.local`, MIN_DATE),
  new Directory(`${Paths.USER_HOME}/Code`, MIN_DATE),
  new Directory(Paths.USER_DESKTOP, MIN_DATE),
  new Directory(Paths.USER_DOCUMENTS, MIN_DATE),
  new Directory(Paths.USER_DOWNLOADS, MIN_DATE),
  new Directory(Paths.USER_GAMES, MIN_DATE),
  new Directory(Paths.USER_LIBRARIES, MIN_DATE),
  new Directory(`${Paths.USER_LIBRARIES}/Draco`, MIN_DATE),
  new Directory(Paths.USER_MUSIC, MIN_DATE),
  new Directory(Paths.USER_PICTURES, MIN_DATE),
  new Directory(Paths.USER_VIDEOS, MIN_DATE),

  new Directory("/media", MIN_DATE),
  new Directory("/mnt", MIN_DATE),
  new Directory("/opt", MIN_DATE),
  new Directory("/proc", MIN_DATE),
  new Directory("/sys", MIN_DATE),
  new Directory("/tmp", MIN_DATE),
  new Directory("/usr", MIN_DATE),
  new Directory("/var", MIN_DATE),
];

export default DirectoryData;
