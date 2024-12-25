import type { IListable } from "~/core/acore-ts/repository/abstraction/IRepository";
import type Technology from "~/domain/models/Technology";

export default interface ITechnologiesService extends IListable<Technology> {}
