import Entity from "~/core/acore-ts/domain/abstraction/Entity";
import type { Apps } from "../data/Apps";
import type Icons from "../data/Icons";
import type { TranslationKey } from "../data/Translations";
import type { CategoryId } from "./Category";

export type AppId = Apps;

export default class App extends Entity<AppId> {
  constructor(
    id: AppId,
    public categoryId: CategoryId,
    public name: TranslationKey,
    public icon: Icons,
    public path: string,
    createdDate: Date,
    public process?: () => void,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
