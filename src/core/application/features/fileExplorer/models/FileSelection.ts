export interface SelectedFile {
  path: string;
  name: string;
  type: "file" | "directory";
  size?: number;
  extension?: string;
}

export enum FileViewMode {
  GRID = "grid",
  LIST = "list",
}

export enum FileSortCriteria {
  NAME = "name",
  SIZE = "size",
  MODIFIED = "modified",
  TYPE = "type",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export interface FileExplorerState {
  currentPath: string;
  files: SelectedFile[];
  selectedFiles: Set<string>;
  viewMode: FileViewMode;
  sortBy: FileSortCriteria;
  sortOrder: SortOrder;
  isLoading: boolean;
  error?: string;
  showHidden?: boolean;
  refreshCounter?: number;
}
