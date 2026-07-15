import App from "@domain/models/App";
import { Categories } from "./Categories";
import Icons from "./Icons";
import { TranslationKeys } from "./Translations";

export enum Apps {
  doom = "doom",
  email = "email",
  terminal = "terminal",
  welcome = "welcome",
  fileExplorer = "fileExplorer",
  textEditor = "textEditor",
  mediaViewer = "mediaViewer",
}

const AppsData = [
  new App(
    Apps.welcome,
    Categories.apps,
    TranslationKeys.apps_welcome_wizard,
    Icons.computer,
    "about-me",
    new Date("2024-12-06 13:29:08"),
  ),
  new App(
    Apps.email,
    Categories.apps,
    TranslationKeys.common_contact,
    Icons.envelope,
    "contact",
    new Date("2024-12-06 21:57:49"),
  ),
  new App(Apps.doom, Categories.games, TranslationKeys.apps_doom, Icons.doom, "doom", new Date("2024-12-15 18:30:49")),
  new App(
    Apps.terminal,
    Categories.system,
    TranslationKeys.apps_terminal,
    Icons.terminal,
    "terminal",
    new Date("2024-12-21 18:21:36"),
  ),
  new App(
    Apps.fileExplorer,
    Categories.system,
    TranslationKeys.apps_file_explorer,
    Icons.folder,
    "file-explorer",
    new Date("2025-11-23 18:45:15"),
  ),
  new App(
    Apps.textEditor,
    Categories.system,
    TranslationKeys.apps_text_editor,
    Icons.edit,
    "text-editor",
    new Date("2026-07-12 00:31:55"),
    { allowMultipleInstances: true },
  ),
  new App(
    Apps.mediaViewer,
    Categories.apps,
    TranslationKeys.apps_media_viewer,
    Icons.image,
    "media-viewer",
    new Date("2026-07-15 00:00:00"),
    { allowMultipleInstances: true },
  ),
];
export default AppsData;
