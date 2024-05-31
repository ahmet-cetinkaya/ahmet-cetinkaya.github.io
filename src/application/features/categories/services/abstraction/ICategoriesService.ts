import type { IListable } from '@corePackages/ahmet-cetinkaya-core/repository/abstraction/IRepository';
import type { Category } from '~/domain/models/Category';

export interface ICategoriesService extends IListable<Category> {}
