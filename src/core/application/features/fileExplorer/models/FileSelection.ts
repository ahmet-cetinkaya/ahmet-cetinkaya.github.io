export interface SelectedFile {
  path: string;
  name: string;
  type: "file" | "directory";
  size?: number;
  extension?: string;
}

/**
 * Factory for creating SelectedFile with validation
 */
export function createSelectedFile(data: {
  path: string;
  name: string;
  type: "file" | "directory";
  size?: number;
  extension?: string;
}): SelectedFile {
  // Validate path and name consistency - name should be the last path segment
  const expectedName = data.path.split("/").pop() || "";
  if (data.name !== expectedName) {
    throw new Error(`Invalid SelectedFile: name "${data.name}" does not match path "${data.path}"`);
  }

  return data;
}

export interface FileSelection {
  files: SelectedFile[];
  primary?: SelectedFile;
}

/**
 * Factory for creating FileSelection with validation
 */
export function createFileSelection(data: { files: SelectedFile[]; primary?: SelectedFile }): FileSelection {
  // Validate primary is in files array if provided
  if (data.primary) {
    const filePaths = new Set(data.files.map((f) => f.path));
    if (!filePaths.has(data.primary.path)) {
      throw new Error(`Invalid FileSelection: primary file "${data.primary.path}" not in files array`);
    }
  }

  return data;
}

export interface FileClipboard {
  operation: "copy" | "move";
  files: SelectedFile[];
  sourcePath?: string;
}

export interface FileContextMenu {
  x: number;
  y: number;
  targetPath: string;
  targetType: "file" | "directory" | "background";
  selectedFiles: string[];
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
