import type Technology from "@domain/models/Technology";
import type { IListable } from "@packages/acore-ts/repository/abstraction/IRepository";

export default interface ITechnologiesService extends IListable<Technology> {}
