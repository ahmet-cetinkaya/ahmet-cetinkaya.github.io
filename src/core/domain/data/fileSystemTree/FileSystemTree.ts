import { Apps } from "@domain/data/Apps";
import { RemoteContentType, serializeRemoteContent } from "@domain/data/remoteContent/remoteContent";

export type FileSystemTreeDirectoryNode = {
  kind: "directory";
  name: string;
  createdDate: Date;
  updatedDate?: Date;
  children?: FileSystemTreeNode[];
};

export type FileSystemTreeFileNode = {
  kind: "file";
  name: string;
  content: string;
  createdDate: Date;
  updatedDate?: Date;
  size?: number;
};

export type FileSystemTreeNode = FileSystemTreeDirectoryNode | FileSystemTreeFileNode;

const fileSystemTree: FileSystemTreeDirectoryNode = {
  kind: "directory",
  name: "",
  createdDate: new Date("2022-08-11 17:22:15"),
  updatedDate: new Date("2022-08-11 17:22:15"),
  children: [
    { kind: "directory", name: "bin", createdDate: new Date("2022-08-11 17:22:15") },
    { kind: "directory", name: "dev", createdDate: new Date("2022-08-11 17:22:15") },
    { kind: "directory", name: "etc", createdDate: new Date("2022-08-11 17:22:15") },
    {
      kind: "directory",
      name: "home",
      createdDate: new Date("2024-12-24 12:49:08"),
      children: [
        {
          kind: "directory",
          name: "ac",
          createdDate: new Date("2024-12-24 12:49:08"),
          updatedDate: new Date("2024-12-24 12:49:08"),
          children: [
            {
              kind: "file",
              name: ".bash_history",
              content: "",
              createdDate: new Date("2024-12-24 12:49:08"),
            },
            {
              kind: "file",
              name: ".bashrc",
              content: `# .bashrc configuration
  export PATH=$PATH:/usr/local/bin`,
              createdDate: new Date("2024-12-24 12:49:08"),
            },
            {
              kind: "file",
              name: ".gitconfig",
              content: `[user]
  name = Ahmet Çetinkaya
  email = ahmetcetinkaya@tutamail.com`,
              createdDate: new Date("2024-12-24 12:49:08"),
            },
            {
              kind: "directory",
              name: ".cache",
              createdDate: new Date("2024-12-24 12:49:08"),
              updatedDate: new Date("2024-12-24 12:49:08"),
            },
            {
              kind: "directory",
              name: ".config",
              createdDate: new Date("2024-12-24 12:49:08"),
              updatedDate: new Date("2024-12-24 12:49:08"),
            },
            {
              kind: "directory",
              name: ".local",
              createdDate: new Date("2024-12-24 12:49:08"),
              updatedDate: new Date("2024-12-24 12:49:08"),
            },
            {
              kind: "directory",
              name: "Code",
              createdDate: new Date("2025-11-19 17:18:43"),
            },
            {
              kind: "directory",
              name: "Desktop",
              createdDate: new Date("2024-12-24 12:49:08"),
              updatedDate: new Date("2024-12-24 12:49:08"),
              children: [
                {
                  kind: "file",
                  name: "welcome.desktop",
                  content: `[Desktop Entry]
Name=Welcome
Exec=${Apps.welcome}
Icon=computer
Type=Application
Categories=Application;
Terminal=false
StartupNotify=true`,
                  createdDate: new Date("2024-12-24 12:49:08"),
                },
                {
                  kind: "file",
                  name: "contact.desktop",
                  content: `[Desktop Entry]
Name=Contact
Exec=${Apps.email}
Icon=envelope
Type=Application
Categories=Application;
Terminal=false
StartupNotify=true`,
                  createdDate: new Date("2024-12-24 12:49:08"),
                },
                {
                  kind: "file",
                  name: "file-explorer.desktop",
                  content: `[Desktop Entry]
Name=File Explorer
Exec=${Apps.fileExplorer}
Icon=computer
Type=Application
Categories=System;
Terminal=false
StartupNotify=true`,
                  createdDate: new Date("2025-11-23 18:45:15"),
                },
                {
                  kind: "file",
                  name: "terminal.desktop",
                  content: `[Desktop Entry]
Name=Terminal
Exec=${Apps.terminal}
Icon=terminal
Type=Application
Categories=System;Terminal;
Terminal=false
StartupNotify=true`,
                  createdDate: new Date("2024-12-24 12:49:08"),
                },
                {
                  kind: "file",
                  name: "doom.desktop",
                  content: `[Desktop Entry]
Name=Doom
Exec=${Apps.doom}
Icon=doom
Type=Application
Categories=Game;
Terminal=false
StartupNotify=true`,
                  createdDate: new Date("2024-12-24 12:49:08"),
                },
              ],
            },
            {
              kind: "directory",
              name: "Documents",
              createdDate: new Date("2024-12-24 12:49:08"),
              updatedDate: new Date("2024-12-24 12:49:08"),
            },
            {
              kind: "directory",
              name: "Downloads",
              createdDate: new Date("2024-12-24 12:49:08"),
              updatedDate: new Date("2024-12-24 12:49:08"),
            },
            {
              kind: "directory",
              name: "Games",
              createdDate: new Date("2024-12-24 12:49:08"),
              updatedDate: new Date("2024-12-24 12:49:08"),
              children: [
                {
                  kind: "file",
                  name: "doom.jsdos",
                  content: "[DOS executable]",
                  createdDate: new Date("2024-12-24 12:49:08"),
                  size: 2456852,
                },
              ],
            },
            {
              kind: "directory",
              name: "Libraries",
              createdDate: new Date("2024-12-24 12:49:08"),
              updatedDate: new Date("2024-12-24 12:49:08"),
              children: [
                {
                  kind: "directory",
                  name: "Draco",
                  createdDate: new Date("2024-12-25 02:42:08"),
                  updatedDate: new Date("2024-12-25 02:42:08"),
                  children: [
                    {
                      kind: "file",
                      name: "draco_decoder.js",
                      content: serializeRemoteContent({
                        type: RemoteContentType.JAVASCRIPT,
                        format: "js",
                        url: "https://raw.githubusercontent.com/google/draco/refs/heads/main/javascript/draco_decoder.js",
                      }),
                      createdDate: new Date("2024-12-25 02:42:08"),
                      updatedDate: new Date("2024-12-25 02:42:08"),
                    },
                    {
                      kind: "file",
                      name: "draco_decoder.wasm",
                      content: serializeRemoteContent({
                        type: RemoteContentType.WASM,
                        format: "wasm",
                        url: "https://raw.githubusercontent.com/google/draco/refs/heads/main/javascript/draco_decoder.wasm",
                      }),
                      createdDate: new Date("2024-12-25 02:42:08"),
                      updatedDate: new Date("2024-12-25 02:42:08"),
                    },
                    {
                      kind: "file",
                      name: "draco_encoder.js",
                      content: serializeRemoteContent({
                        type: RemoteContentType.JAVASCRIPT,
                        format: "js",
                        url: "https://raw.githubusercontent.com/google/draco/refs/heads/main/javascript/draco_encoder.js",
                      }),
                      createdDate: new Date("2024-12-25 02:42:08"),
                      updatedDate: new Date("2024-12-25 02:42:08"),
                    },
                    {
                      kind: "file",
                      name: "draco_wasm_wrapper.js",
                      content: serializeRemoteContent({
                        type: RemoteContentType.JAVASCRIPT,
                        format: "js",
                        url: "https://raw.githubusercontent.com/google/draco/refs/heads/main/javascript/draco_wasm_wrapper.js",
                      }),
                      createdDate: new Date("2024-12-25 02:42:08"),
                      updatedDate: new Date("2024-12-25 02:42:08"),
                    },
                  ],
                },
              ],
            },
            {
              kind: "directory",
              name: "Music",
              createdDate: new Date("2024-12-24 12:49:08"),
              updatedDate: new Date("2024-12-24 12:49:08"),
            },
            {
              kind: "directory",
              name: "Pictures",
              createdDate: new Date("2024-12-24 12:49:08"),
              updatedDate: new Date("2024-12-24 12:49:08"),
              children: [
                {
                  kind: "directory",
                  name: "code-space",
                  createdDate: new Date("2025-11-21 20:59:45"),
                  updatedDate: new Date("2025-11-21 20:59:45"),
                  children: [
                    {
                      kind: "file",
                      name: "code-space.jpg",
                      content: "[PNG Image data]",
                      createdDate: new Date("2025-11-21 20:59:45"),
                      updatedDate: new Date("2025-11-21 20:59:45"),
                      size: 6653474,
                    },
                  ],
                },
                {
                  kind: "file",
                  name: "ahmet-cetinkaya-profile.png",
                  content: "[PNG Image data]",
                  createdDate: new Date("2024-12-24 12:49:08"),
                  size: 5063,
                },
                {
                  kind: "file",
                  name: "ahmet-cetinkaya-profile-landscape.png",
                  content: "[PNG Image data]",
                  createdDate: new Date("2024-12-24 12:49:08"),
                  size: 6715,
                },
              ],
            },
            {
              kind: "directory",
              name: "Videos",
              createdDate: new Date("2024-12-24 12:49:08"),
              updatedDate: new Date("2024-12-24 12:49:08"),
              children: [
                {
                  kind: "file",
                  name: "my-private-video.mp4",
                  content: serializeRemoteContent({
                    type: RemoteContentType.VIDEO,
                    format: "mp4",
                    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  }),
                  createdDate: new Date("2026-07-15 17:16:28"),
                  updatedDate: new Date("2026-07-20 12:52:59"),
                },
              ],
            },
          ],
        },
      ],
    },
    { kind: "directory", name: "media", createdDate: new Date("2022-08-11 17:22:15") },
    { kind: "directory", name: "mnt", createdDate: new Date("2022-08-11 17:22:15") },
    { kind: "directory", name: "opt", createdDate: new Date("2022-08-11 17:22:15") },
    { kind: "directory", name: "proc", createdDate: new Date("2022-08-11 17:22:15") },
    { kind: "directory", name: "sys", createdDate: new Date("2022-08-11 17:22:15") },
    { kind: "directory", name: "tmp", createdDate: new Date("2022-08-11 17:22:15") },
    { kind: "directory", name: "usr", createdDate: new Date("2022-08-11 17:22:15") },
    { kind: "directory", name: "var", createdDate: new Date("2022-08-11 17:22:15") },
  ],
};

export default fileSystemTree;
