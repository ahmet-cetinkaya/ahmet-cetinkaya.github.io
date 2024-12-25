import type IAppsService from "~/application/features/apps/services/abstraction/IAppsService";
import type ICategoriesService from "~/application/features/categories/services/abstraction/ICategoriesService";
import type ICertificationsService from "~/application/features/certifications/services/abstraction/ICertificationsService";
import type ICurriculumVitaeService from "~/application/features/curriculumVitae/services/abstraction/ICurriculumVitaeService";
import type IWindowsService from "~/application/features/desktop/services/abstraction/IWindowsService";
import type IEducationsService from "~/application/features/educations/services/abstraction/IEducationsService";
import type ILinksService from "~/application/features/links/abstraction/ILinksService";
import type IOrganizationsService from "~/application/features/organizations/services/abstraction/IOrganizationsService";
import type ITechnologiesService from "~/application/features/technologies/services/abstraction/ITechnologiesService";
import type II18n from "~/core/acore-ts/i18n/abstraction/II18n";
import I18n from "~/core/acore-ts/i18n/I18n";
import TranslationsData from "~/domain/data/Translations";
import ApplicationContainer, { type IApplicationContainer } from "./../application/ApplicationContainer";
import type IFileSystemService from "~/application/features/system/services/abstraction/IFileSystemService";

export interface IContainer extends IApplicationContainer {
  i18n: II18n;
}

export default class Container implements IContainer {
  private static _instance: IContainer | undefined = undefined;

  private _applicationContainer: ApplicationContainer = new ApplicationContainer();
  private _i18n: II18n | undefined = undefined;

  static get instance(): IContainer {
    if (!Container._instance) Container._instance = new Container();
    return Container._instance;
  }

  get appsService(): IAppsService {
    return this._applicationContainer.appsService;
  }

  get categoriesService(): ICategoriesService {
    return this._applicationContainer.categoriesService;
  }

  get certificationsService(): ICertificationsService {
    return this._applicationContainer.certificationsService;
  }

  get curriculumVitaeService(): ICurriculumVitaeService {
    return this._applicationContainer.curriculumVitaeService;
  }

  get educationsService(): IEducationsService {
    return this._applicationContainer.educationsService;
  }

  get fileSystemService(): IFileSystemService {
    return this._applicationContainer.fileSystemService;
  }

  get linksService(): ILinksService {
    return this._applicationContainer.linksService;
  }

  get technologiesService(): ITechnologiesService {
    return this._applicationContainer.technologiesService;
  }

  get organizationsService(): IOrganizationsService {
    return this._applicationContainer.organizationsService;
  }

  get windowsService(): IWindowsService {
    return this._applicationContainer.windowsService;
  }

  get i18n(): II18n {
    if (!this._i18n) {
      this._i18n = new I18n();
      this._i18n.translations = TranslationsData;
    }
    return this._i18n!;
  }
}
