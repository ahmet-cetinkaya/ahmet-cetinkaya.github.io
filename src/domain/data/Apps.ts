import App from "~/domain/models/App";
import { Categories } from "./Categories";
import Icons from "./Icons";
import { TranslationKeys } from "./Translations";

export enum Apps {
  welcome = 1,
  email,
  doom,
}

const AppsData = [
  new App(
    Apps.welcome,
    Categories.apps,
    TranslationKeys.apps_welcome_wizard,
    Icons.computer,
    "",
    new Date("2024-05-11 15:53:45"),
  ),
  new App(
    Apps.email,
    Categories.apps,
    TranslationKeys.common_contact,
    Icons.envelope,
    "contact",
    new Date("2024-05-11 15:55:45"),
  ),

  new App(Apps.doom, Categories.games, TranslationKeys.games_doom, Icons.doom, "doom", new Date("2024-05-11 15:55:45")),
];
export default AppsData;
