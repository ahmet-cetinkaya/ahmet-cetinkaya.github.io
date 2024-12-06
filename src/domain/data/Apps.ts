import { App } from "~/domain/models/App";
import { Categories } from "./Categories";
import { Icons } from "./Icons";
import { TranslationKeys } from "./Translations";

export enum Apps {
  welcome = 1,
  about = 2,
  contact = 3,
}

export const AppsData = [
  new App(
    Apps.welcome,
    Categories.apps,
    TranslationKeys.apps_welcome_hello,
    Icons.computer,
    "",
    new Date("2024-05-11 15:53:45"),
  ),
  new App(
    Apps.contact,
    Categories.apps,
    TranslationKeys.common_contact,
    Icons.envelope,
    "contact",
    new Date("2024-05-11 15:55:45"),
  ),
];
