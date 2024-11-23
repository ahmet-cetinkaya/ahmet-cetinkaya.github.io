import { Entity } from "~/core/acore-ts/domain/abstraction/Entity";
import type { Position } from "~/core/acore-ts/ui/models/Position";
import type { Size } from "~/core/acore-ts/ui/models/Size";
import type { TranslationKey } from "../data/Translations";
import type { AppId } from "./App";

export type WindowId = string;

export class Window<TContent = unknown> extends Entity<WindowId> {
  constructor(
    id: WindowId,
    public appId: AppId,
    public title: TranslationKey,
    public layer: number = 0,
    public isMinimized: boolean = false,
    public content: TContent | undefined = undefined,
    public position: Position | undefined = undefined,
    public size: Size | undefined = undefined,
    createdDate: Date = new Date(),
    updatedDate: Date | null | undefined = null,
  ) {
    super(id, createdDate, updatedDate);
    this.layer = layer;
  }
}
