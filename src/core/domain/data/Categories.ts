import Category from "@domain/models/Category";
import { TranslationKeys } from "./Translations";

export enum Categories {
  apps = 1,
  games,
  system,
}

const CategoriesData = [
  new Category(Categories.apps, TranslationKeys.common_apps, new Date("2024-05-11 15:54:45")),
  new Category(Categories.games, TranslationKeys.common_games, new Date("2024-05-11 15:55:45")),
  new Category(Categories.system, TranslationKeys.common_system, new Date("2024-05-11 15:55:45")),
];
export default CategoriesData;
