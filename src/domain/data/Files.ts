import File from "../models/File";
import { Apps } from "./Apps";
import { Paths } from "./Directories";

const FilesData: File[] = [
  new File(`${Paths.USER_HOME}/.bash_history`, ``, new Date("2024-12-17 14:16:37")),
  new File(
    `${Paths.USER_HOME}/.bashrc`,
    `# .bashrc configuration
  export PATH=$PATH:/usr/local/bin`,
    new Date("2024-12-17 14:16:37"),
  ),
  new File(
    `${Paths.USER_HOME}/.gitconfig`,
    `[user]
  name = Ahmet Çetinkaya
  email = ahmetcetinkaya@tutamail.com`,
    new Date("2024-12-17 14:16:37"),
  ),

  // Media files
  new File(
    `${Paths.USER_PICTURES}/code-space/code-space.jpg`,
    "[PNG Image data]",
    new Date("2024-12-17 14:16:37"),
    6653474,
  ),
  new File(
    `${Paths.USER_PICTURES}/ahmet-cetinkaya-profile.png`,
    "[PNG Image data]",
    new Date("2024-12-22 15:46:19"),
    5063,
  ),
  new File(
    `${Paths.USER_PICTURES}/ahmet-cetinkaya-profile-landscape.png`,
    "[PNG Image data]",
    new Date("2024-12-22 15:46:19"),
    6715,
  ),

  // Game files
  new File(`${Paths.USER_GAMES}/doom.jsdos`, "[DOS executable]", new Date("2024-12-17 14:16:37"), 2456852),

  // Desktop shortcuts
  new File(
    `${Paths.USER_DESKTOP}/welcome.desktop`,
    `[Desktop Entry]
Name=Welcome
Exec=${Apps.welcome}`,
    new Date("2024-12-20 21:19:28"),
  ),
  new File(
    `${Paths.USER_DESKTOP}/contact.desktop`,
    `[Desktop Entry]
Name=Contact
Exec=${Apps.email}`,
    new Date("2024-12-20 21:19:28"),
  ),
  new File(
    `${Paths.USER_DESKTOP}/terminal.desktop`,
    `[Desktop Entry]
Name=Terminal
Exec=${Apps.terminal}`,
    new Date("2024-12-20 21:19:28"),
  ),
  new File(
    `${Paths.USER_DESKTOP}/doom.desktop`,
    `[Desktop Entry]
Name=Doom
Exec=${Apps.doom}`,
    new Date("2024-12-20 21:19:28"),
  ),
];

export default FilesData;