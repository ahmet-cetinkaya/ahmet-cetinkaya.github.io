import type { IAppsService } from "~/application/features/app/services/abstraction/IAppsService";
import type { ICategoriesService } from "~/application/features/categories/services/abstraction/ICategoriesService";
import type { IWindowsService } from "~/application/features/desktop/services/abstraction/IWindowsService";
import { ApplicationContainer, type IApplicationContainer } from "./../application/ApplicationContainer";

export interface IContainer extends IApplicationContainer {}

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

  static get instance(): IContainer {
    return _container;
  }
}

const _container = new Container();
