import type { PaginationResult } from '../PaginationResult';

export interface IListable<T> {
  getAll(predicate?: (x: T) => boolean): Promise<T[]>;
  getList(pageIndex: number, pageSize: number, predicate?: (x: T) => boolean): Promise<PaginationResult<T>>;
}

export interface ICountable {
  count(): Promise<number>;
}

export interface IGettable<T> {
  get(predicate: (x: T) => boolean): Promise<T | null>;
}

export interface IAddable<T> {
  add(item: T): Promise<void>;
}

export interface IUpdatable<T> {
  update(item: T): Promise<void>;
}

export interface IRemovable<T> {
  remove(predicate: (x: T) => boolean): Promise<void>;
}

export interface IRepository<T>
  extends IListable<T>,
    ICountable,
    IGettable<T>,
    IAddable<T>,
    IUpdatable<T>,
    IRemovable<T> {}
