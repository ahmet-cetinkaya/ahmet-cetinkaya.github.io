import Directory from "../models/Directory";

const MIN_DATE = new Date(0);

export enum Paths {
  ROOT = "/",
  HOME = "home",
  USER_HOME = "/home/ac",
}

const DirectoryData: Directory[] = [
  new Directory(Paths.ROOT, MIN_DATE),

  new Directory("/bin", MIN_DATE),
  new Directory("/dev", MIN_DATE),
  new Directory("/etc", MIN_DATE),

  new Directory("/home", MIN_DATE),

  new Directory(Paths.USER_HOME, MIN_DATE),
  new Directory("/home/ac/Downloads", MIN_DATE),
  new Directory("/home/ac/Documents", MIN_DATE),
  new Directory("/home/ac/Pictures", MIN_DATE),
  new Directory("/home/ac/Music", MIN_DATE),
  new Directory("/home/ac/Videos", MIN_DATE),
  new Directory("/home/ac/Desktop", MIN_DATE),
  new Directory("/home/ac/Code", MIN_DATE),
  new Directory("/home/ac/.config", MIN_DATE),
  new Directory("/home/ac/.local", MIN_DATE),
  new Directory("/home/ac/.cache", MIN_DATE),

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
