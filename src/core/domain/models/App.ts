import type { Apps } from "@domain/data/Apps";
import type Icons from "@domain/data/Icons";
import type { TranslationKey } from "@domain/data/Translations";
import Entity from "@packages/acore-ts/domain/abstraction/Entity";
import type { CategoryId } from "./Category";

export type AppId = Apps;

type AppOptions = {
  process?: () => void;
  updatedDate?: Date;
  allowMultipleInstances?: boolean;
};

export default class App extends Entity<AppId> {
  public readonly process?: () => void;
  public readonly allowMultipleInstances: boolean;

  constructor(
    id: AppId,
    public categoryId: CategoryId,
    public name: TranslationKey,
    public icon: Icons,
    public path: string,
    createdDate: Date,
    options: AppOptions = {},
  ) {
    super(id, createdDate, options.updatedDate);
    this.process = options.process;
    this.allowMultipleInstances = options.allowMultipleInstances ?? false;
  }
}
