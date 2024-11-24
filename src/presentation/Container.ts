import type { IAppsService } from "~/application/features/app/services/abstraction/IAppsService";
import type { ICategoriesService } from "~/application/features/categories/services/abstraction/ICategoriesService";
import type { IWindowsService } from "~/application/features/desktop/services/abstraction/IWindowsService";
import type { II18n } from "~/core/acore-ts/i18n/abstraction/II18n";
import { I18n } from "~/core/acore-ts/i18n/I18n";
import { Translations } from "~/domain/data/Translations";
import { ApplicationContainer, type IApplicationContainer } from "./../application/ApplicationContainer";

export interface IContainer extends IApplicationContainer {
  i18n: II18n;
}

export class Container implements IContainer {
  private _applicationContainer: ApplicationContainer = new ApplicationContainer();

  get appsService(): IAppsService {
    return this._applicationContainer.appsService;
  }

  get categoriesService(): ICategoriesService {
    return this._applicationContainer.categoriesService;
  }

  get windowsService(): IWindowsService {
    return this._applicationContainer.windowsService;
  }

  private _i18n: II18n | null = null;
  get i18n(): II18n {
    if (this._i18n === null) {
      this._i18n = new I18n();
      this._i18n.translations = Translations;
    }
    return this._i18n;
  }

  static get instance(): IContainer {
    return _container;
  }
}

const _container = new Container();
