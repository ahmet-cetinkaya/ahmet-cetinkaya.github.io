import { FileSortCriteria, FileViewMode, SortOrder } from "../models/FileSelection";

export const UI_CONSTANTS = {
  DEFAULT_VIEW_MODE: FileViewMode.GRID,
  DEFAULT_SORT_BY: FileSortCriteria.NAME,
  DEFAULT_SORT_ORDER: SortOrder.ASC,
  GRID_ITEM_SIZE: 120,
  LIST_ITEM_HEIGHT: 32,
  CONTEXT_MENU_DELAY: 200,
  ANIMATION_DURATION_MS: 200,
  MAX_VISIBLE_ITEMS: 1000,
} as const;
