import { AppsService } from './application/features/app/services/AppsService';
import type { IAppsService } from './application/features/app/services/abstraction/IAppsService';
import { CategoriesService } from './application/features/categories/services/CategoriesService';
import type { ICategoriesService } from './application/features/categories/services/abstraction/ICategoriesService';
import { WindowsService } from './application/features/desktop/services/WindowsService';
import type { IWindowsService } from './application/features/desktop/services/abstraction/IWindowsService';

export class Container {
  static readonly AppsService: IAppsService = new AppsService();
  static readonly CategoriesService: ICategoriesService = new CategoriesService();
  static readonly WindowsService: IWindowsService = new WindowsService();
}
