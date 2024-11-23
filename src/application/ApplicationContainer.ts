import type { IAppsService } from "./features/app/services/abstraction/IAppsService";
import { AppsService } from "./features/app/services/AppsService";
import type { ICategoriesService } from "./features/categories/services/abstraction/ICategoriesService";
import { CategoriesService } from "./features/categories/services/CategoriesService";
import type { IWindowsService } from "./features/desktop/services/abstraction/IWindowsService";
import { WindowsService } from "./features/desktop/services/WindowsService";

export interface IApplicationContainer {
  appsService: IAppsService;
  categoriesService: ICategoriesService;
  windowsService: IWindowsService;
}

export class ApplicationContainer implements IApplicationContainer {
  private _appsService: IAppsService | null = null;
  private _categoriesService: ICategoriesService | null = null;
  private _windowsService: IWindowsService | null = null;

  get appsService(): IAppsService {
    if (this._appsService === null) this._appsService = new AppsService();
    return this._appsService;
  }

  get categoriesService(): ICategoriesService {
    if (this._categoriesService === null) this._categoriesService = new CategoriesService();
    return this._categoriesService;
  }

  get windowsService(): IWindowsService {
    if (this._windowsService === null) this._windowsService = new WindowsService();
    return this._windowsService;
  }
}
