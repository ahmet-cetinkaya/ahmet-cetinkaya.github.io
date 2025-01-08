import Link from "../models/Link";
import Icons from "./Icons";
import { TranslationKeys } from "./Translations";

export enum Links {
  github = 1,
  linkedin = 2,
  email = 3,
  itchio = 4,
  mastodon = 5,
  x = 6,
  instagram = 7,
  donate = 8,
}

const LinksData = [
  new Link(
    Links.github,
    TranslationKeys.links_github,
    "https://github.com/ahmet-cetinkaya",
    Icons.github,
    new Date("2024-05-16 20:10:19"),
  ),
  new Link(
    Links.linkedin,
    TranslationKeys.links_linkedin,
    "https://linkedin.com/in/ahmet-cetinkaya",
    Icons.linkedin,
    new Date("2024-05-16 20:10:19"),
  ),
  new Link(
    Links.donate,
    TranslationKeys.links_donate,
    "https://www.buymeacoffee.com/ahmetcetinkaya",
    Icons.donate,
    new Date("2024-12-25 20:27:52"),
  ),
  new Link(
    Links.email,
    TranslationKeys.common_email,
    "mailto:contact@ahmetcetinkaya.me",
    Icons.envelope,
    new Date("2024-05-16 20:10:19"),
  ),
  new Link(
    Links.itchio,
    TranslationKeys.links_itchio,
    "https://ahmetcetinkaya.itch.io/",
    Icons.itchio,
    new Date("2024-05-16 20:10:19"),
  ),
  new Link(
    Links.mastodon,
    TranslationKeys.links_mastodon,
    "https://mastodon.social/@ahmetcetinkaya",
    Icons.mastodon,
    new Date("2024-05-16 20:10:19"),
  ),
  new Link(
    Links.x,
    TranslationKeys.links_x,
    "https://twitter.com/ahmetctnky_dev",
    Icons.x,
    new Date("2024-05-16 20:10:19"),
  ),
  new Link(
    Links.instagram,
    TranslationKeys.links_instagram,
    "https://www.instagram.com/ahmetcetinkaya.raw/",
    Icons.instagram,
    new Date("2024-05-16 20:10:19"),
  ),
];
export default LinksData;
