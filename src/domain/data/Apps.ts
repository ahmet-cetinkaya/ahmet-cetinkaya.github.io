import { App } from "~/domain/models/App";
import { Categories } from "./Categories";

export enum Apps {
  about = 1,
  contact = 2,
}

export const AppsData = [
  new App(Apps.about, Categories.apps, "aboutMe", "computer", "about-me", new Date("2024-05-11 15:54:45")),
  new App(Apps.contact, Categories.apps, "contact", "mail", "contact", new Date("2024-05-11 15:55:45")),
];
