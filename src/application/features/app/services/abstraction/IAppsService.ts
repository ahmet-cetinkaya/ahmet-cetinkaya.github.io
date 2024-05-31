import type { IGettable, IListable } from '@corePackages/ahmet-cetinkaya-core/repository/abstraction/IRepository';
import type { App } from '~/domain/models/App';

export interface IAppsService extends IListable<App>, IGettable<App> {}
