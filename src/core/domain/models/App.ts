import type { Apps } from "@domain/data/Apps";
import type Icons from "@domain/data/Icons";
import type { TranslationKey } from "@domain/data/Translations";
import Entity from "@packages/acore-ts/domain/abstraction/Entity";
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
