import File from "@domain/models/File";
import { Apps } from "./Apps";
import { Paths } from "./Directories";

const DATE_BASH_FILES = new Date("2024-12-24 12:49:08");
const DATE_PROFILE_IMAGE = new Date("2024-12-24 12:49:08");
const DATE_CODE_SPACE = new Date("2025-11-21 20:59:45");
const DATE_DOOM = new Date("2024-12-24 12:49:08");
const DATE_DRACO = new Date("2024-12-25 02:42:08");
const DATE_DESKTOP_SHORTCUTS = new Date("2024-12-24 12:49:08");
const DATE_FILE_EXPLORER = new Date("2025-11-23 18:45:15");
const DATE_TERMINAL = new Date("2024-12-24 12:49:08");

const FilesData: File[] = [
  new File(`${Paths.USER_HOME}/.bash_history`, ``, DATE_BASH_FILES),
  new File(
    `${Paths.USER_HOME}/.bashrc`,
    `# .bashrc configuration
  export PATH=$PATH:/usr/local/bin`,
    DATE_BASH_FILES,
  ),
  new File(
    `${Paths.USER_HOME}/.gitconfig`,
    `[user]
  name = Ahmet Çetinkaya
  email = ahmetcetinkaya@tutamail.com`,
    DATE_BASH_FILES,
  ),

  // Media files
  new File(
    `${Paths.USER_PICTURES}/code-space/code-space.jpg`,
    "[PNG Image data]",
    DATE_CODE_SPACE,
    6653474,
    DATE_CODE_SPACE,
  ),
  new File(`${Paths.USER_PICTURES}/ahmet-cetinkaya-profile.png`, "[PNG Image data]", DATE_PROFILE_IMAGE, 5063),
  new File(
    `${Paths.USER_PICTURES}/ahmet-cetinkaya-profile-landscape.png`,
    "[PNG Image data]",
    DATE_PROFILE_IMAGE,
    6715,
  ),

  // Game files
  new File(`${Paths.USER_GAMES}/doom.jsdos`, "[DOS executable]", DATE_DOOM, 2456852),

  // Libs `draco_decoder.js`, `draco_decoder.wasm`, `draco_encoder.js`, and `draco_wasm_wrapper.js`
  new File(
    `${Paths.USER_LIBRARIES}/Draco/draco_decoder.js`,
    "https://raw.githubusercontent.com/google/draco/refs/heads/main/javascript/draco_decoder.js",
    DATE_DRACO,
    undefined,
    DATE_DRACO,
  ),
  new File(
    `${Paths.USER_LIBRARIES}/Draco/draco_decoder.wasm`,
    "https://raw.githubusercontent.com/google/draco/refs/heads/main/javascript/draco_decoder.wasm",
    DATE_DRACO,
    undefined,
    DATE_DRACO,
  ),
  new File(
    `${Paths.USER_LIBRARIES}/Draco/draco_encoder.js`,
    "https://raw.githubusercontent.com/google/draco/refs/heads/main/javascript/draco_encoder.js",
    DATE_DRACO,
    undefined,
    DATE_DRACO,
  ),
  new File(
    `${Paths.USER_LIBRARIES}/Draco/draco_wasm_wrapper.js`,
    "https://raw.githubusercontent.com/google/draco/refs/heads/main/javascript/draco_wasm_wrapper.js",
    DATE_DRACO,
    undefined,
    DATE_DRACO,
  ),

  // Desktop shortcuts
  new File(
    `${Paths.USER_DESKTOP}/welcome.desktop`,
    `[Desktop Entry]
Name=Welcome
Exec=${Apps.welcome}
Icon=computer
Type=Application
Categories=Application;
Terminal=false
StartupNotify=true`,
    DATE_DESKTOP_SHORTCUTS,
  ),
  new File(
    `${Paths.USER_DESKTOP}/contact.desktop`,
    `[Desktop Entry]
Name=Contact
Exec=${Apps.email}
Icon=envelope
Type=Application
Categories=Application;
Terminal=false
StartupNotify=true`,
    DATE_DESKTOP_SHORTCUTS,
  ),
  new File(
    `${Paths.USER_DESKTOP}/file-explorer.desktop`,
    `[Desktop Entry]
Name=File Explorer
Exec=${Apps.fileExplorer}
Icon=computer
Type=Application
Categories=System;
Terminal=false
StartupNotify=true`,
    DATE_FILE_EXPLORER,
  ),
  new File(
    `${Paths.USER_DESKTOP}/terminal.desktop`,
    `[Desktop Entry]
Name=Terminal
Exec=${Apps.terminal}
Icon=terminal
Type=Application
Categories=System;Terminal;
Terminal=false
StartupNotify=true`,
    DATE_TERMINAL,
  ),
  new File(
    `${Paths.USER_DESKTOP}/doom.desktop`,
    `[Desktop Entry]
Name=Doom
Exec=${Apps.doom}
Icon=doom
Type=Application
Categories=Game;
Terminal=false
StartupNotify=true`,
    DATE_DOOM,
  ),
];

export default FilesData;
