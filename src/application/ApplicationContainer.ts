import type IAppsService from "./features/apps/services/abstraction/IAppsService";
import AppsService from "./features/apps/services/AppsService";
import type ICategoriesService from "./features/categories/services/abstraction/ICategoriesService";
import CategoriesService from "./features/categories/services/CategoriesService";
import type ICertificationsService from "./features/certifications/services/abstraction/ICertificationsService";
import CertificationsService from "./features/certifications/services/CertificationsService";
import type ICurriculumVitaeService from "./features/curriculumVitae/services/abstraction/ICurriculumVitaeService";
import CurriculumVitaeService from "./features/curriculumVitae/services/CurriculumVitaeService";
import type IWindowsService from "./features/desktop/services/abstraction/IWindowsService";
import WindowsService from "./features/desktop/services/WindowsService";
import type IEducationsService from "./features/educations/services/abstraction/IEducationsService";
import EducationsService from "./features/educations/services/EducationsService";
import type ILinksService from "./features/links/abstraction/ILinksService";
import LinksService from "./features/links/LinksService";
import type IOrganizationsService from "./features/organizations/services/abstraction/IOrganizationsService";
import OrganizationsService from "./features/organizations/services/OrganizationsService";
import type IFileSystemService from "./features/system/services/abstraction/IFileSystemService";
import FileSystemService from "./features/system/services/FileSystemService";
import type ITechnologiesService from "./features/technologies/services/abstraction/ITechnologiesService";
import TechnologiesService from "./features/technologies/services/TechnologiesService";

export interface IApplicationContainer {
  appsService: IAppsService;
  categoriesService: ICategoriesService;
  certificationsService: ICertificationsService;
  curriculumVitaeService: ICurriculumVitaeService;
  educationsService: IEducationsService;
  fileSystemService: IFileSystemService;
  linksService: ILinksService;
  organizationsService: IOrganizationsService;
  technologiesService: ITechnologiesService;
  windowsService: IWindowsService;
}

export default class ApplicationContainer implements IApplicationContainer {
  private _appsService: IAppsService | undefined = undefined;
  private _categoriesService: ICategoriesService | undefined = undefined;
  private _certificationsService: ICertificationsService | undefined = undefined;
  private _curriculumVitaeService: ICurriculumVitaeService | undefined = undefined;
  private _educationsService: IEducationsService | undefined = undefined;
  private _fileSystemService: IFileSystemService | undefined = undefined;
  private _linksService: ILinksService | undefined = undefined;
  private _organizationsService: IOrganizationsService | undefined = undefined;
  private _technologiesService: ITechnologiesService | undefined = undefined;
  private _windowsService: IWindowsService | undefined = undefined;

  get appsService(): IAppsService {
    if (!this._appsService) this._appsService = new AppsService();
    return this._appsService!;
  }

  get categoriesService(): ICategoriesService {
    if (!this._categoriesService) this._categoriesService = new CategoriesService();
    return this._categoriesService!;
  }

  get certificationsService(): ICertificationsService {
    if (!this._certificationsService) this._certificationsService = new CertificationsService();
    return this._certificationsService!;
  }

  get curriculumVitaeService(): ICurriculumVitaeService {
    if (!this._curriculumVitaeService) this._curriculumVitaeService = new CurriculumVitaeService();
    return this._curriculumVitaeService!;
  }

  get educationsService(): IEducationsService {
    if (!this._educationsService) this._educationsService = new EducationsService();
    return this._educationsService!;
  }

  get fileSystemService(): IFileSystemService {
    if (!this._fileSystemService) this._fileSystemService = new FileSystemService();
    return this._fileSystemService!;
  }

  get linksService(): ILinksService {
    if (!this._linksService) this._linksService = new LinksService();
    return this._linksService!;
  }

  get technologiesService(): ITechnologiesService {
    if (!this._technologiesService) this._technologiesService = new TechnologiesService();
    return this._technologiesService!;
  }

  get organizationsService(): IOrganizationsService {
    if (!this._organizationsService) this._organizationsService = new OrganizationsService();
    return this._organizationsService!;
  }

  get windowsService(): IWindowsService {
    if (!this._windowsService) this._windowsService = new WindowsService();
    return this._windowsService!;
  }
}
