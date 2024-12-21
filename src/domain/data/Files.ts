import File from "../models/File";
import { Apps } from "./Apps";

const FilesData: File[] = [
  new File("/home/ac/.bash_history", ``, new Date("2024-12-17 14:16:37")),
  new File(
    "/home/ac/.bashrc",
    `# .bashrc configuration
  export PATH=$PATH:/usr/local/bin`,
    new Date("2024-12-17 14:16:37"),
  ),
  new File(
    "/home/ac/.gitconfig",
    `[user]
  name = Ahmet Çetinkaya
  email = ahmetcetinkaya@tutamail.com`,
    new Date("2024-12-17 14:16:37"),
  ),

  // Media files
  new File("/home/ac/Pictures/code-space/code-space.jpg", "[PNG Image data]", new Date("2024-12-17 14:16:37")),

  // Desktop shortcuts
  new File(
    "/home/ac/Desktop/welcome.desktop",
    `[Desktop Entry]
Name=Welcome
Exec=${Apps.welcome}`,
    new Date("2024-12-20 21:19:28"),
  ),
  new File(
    "/home/ac/Desktop/contact.desktop",
    `[Desktop Entry]
Name=Contact
Exec=${Apps.email}`,
    new Date("2024-12-20 21:19:28"),
  ),
  new File(
    "/home/ac/Desktop/terminal.desktop",
    `[Desktop Entry]
Name=Terminal
Exec=${Apps.terminal}`,
    new Date("2024-12-20 21:19:28"),
  ),
  new File(
    "/home/ac/Desktop/doom.desktop",
    `[Desktop Entry]
Name=Doom
Exec=${Apps.doom}`,
    new Date("2024-12-20 21:19:28"),
  ),
];

export default FilesData;
