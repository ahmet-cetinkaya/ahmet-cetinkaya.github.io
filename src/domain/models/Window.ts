import Entity from "~/core/acore-ts/domain/abstraction/Entity";
import type Position from "~/core/acore-ts/ui/models/Position";
import type Size from "~/core/acore-ts/ui/models/Size";
import type { TranslationKey } from "../data/Translations";
import type { AppId } from "./App";

export type WindowId = string;

export default class Window extends Entity<WindowId> {
  constructor(
    id: WindowId,
    public appId: AppId,
    public title: TranslationKey,
    public layer: number = 0,
    public isMinimized: boolean = false,
    public isMaximized: boolean = false,
    public position: Position | undefined = undefined,
    public size: Size | undefined = undefined,
    createdDate: Date = new Date(),
    public args?: string[],
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
    this.layer = layer;
  }
}
