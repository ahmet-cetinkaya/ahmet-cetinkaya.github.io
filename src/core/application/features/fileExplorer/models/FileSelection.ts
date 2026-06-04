/**
 * Module-level brand symbol for runtime validation
 */
const VALIDATED_FILE_BRAND = Symbol("validated");
const VALIDATED_SELECTION_BRAND = Symbol("validated_selection");

/**
 * Branded type to distinguish validated SelectedFile instances
 */
export interface ValidatedSelectedFile {
  readonly __brand: typeof VALIDATED_FILE_BRAND;
  readonly path: string;
  readonly name: string;
  readonly type: "file" | "directory";
  readonly size?: number;
  readonly extension?: string;
}

export interface SelectedFile {
  path: string;
  name: string;
  type: "file" | "directory";
  size?: number;
  extension?: string;
}

/**
 * Type guard to check if a SelectedFile is validated
 */
export function isValidatedSelectedFile(obj: unknown): obj is ValidatedSelectedFile {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  const candidate = obj as Record<string, unknown>;
  return (
    "__brand" in candidate &&
    candidate.__brand === VALIDATED_FILE_BRAND &&
    "path" in candidate &&
    "name" in candidate &&
    "type" in candidate
  );
}

/**
 * Factory for creating validated SelectedFile with compile-time and runtime safety
 */
export function createSelectedFile(data: {
  path: string;
  name: string;
  type: "file" | "directory";
  size?: number;
  extension?: string;
}): ValidatedSelectedFile {
  // Validate path and name consistency - name should be the last path segment
  const expectedName = data.path.split("/").pop() || "";
  if (data.name !== expectedName) {
    throw new Error(`Invalid SelectedFile: name "${data.name}" does not match path "${data.path}"`);
  }

  // Return as branded validated type with module-level symbol
  return Object.freeze({
    __brand: VALIDATED_FILE_BRAND,
    path: data.path,
    name: data.name,
    type: data.type,
    size: data.size,
    extension: data.extension,
  }) as ValidatedSelectedFile;
}

/**
 * Branded type to distinguish validated FileSelection instances
 */
export interface ValidatedFileSelection {
  readonly __brand: typeof VALIDATED_SELECTION_BRAND;
  readonly files: ReadonlyArray<ValidatedSelectedFile>;
  readonly primary?: ValidatedSelectedFile;
}

export interface FileSelection {
  files: SelectedFile[];
  primary?: SelectedFile;
}

/**
 * Type guard to check if a FileSelection is validated
 */
export function isValidatedFileSelection(obj: unknown): obj is ValidatedFileSelection {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  const candidate = obj as Record<string, unknown>;
  return (
    "__brand" in candidate &&
    candidate.__brand === VALIDATED_SELECTION_BRAND &&
    "files" in candidate &&
    Array.isArray(candidate.files)
  );
}

/**
 * Factory for creating validated FileSelection with compile-time and runtime safety
 */
export function createFileSelection(data: {
  files: Array<SelectedFile | ValidatedSelectedFile>;
  primary?: SelectedFile | ValidatedSelectedFile;
}): ValidatedFileSelection {
  // Validate and convert all files to validated instances
  const validatedFiles = data.files.map((file) => {
    if (isValidatedSelectedFile(file)) {
      return file;
    }
    return createSelectedFile(file);
  });

  // Validate primary is in files array if provided
  let validatedPrimary: ValidatedSelectedFile | undefined;
  if (data.primary) {
    const filePaths = new Set(validatedFiles.map((f) => f.path));
    const primaryPath = data.primary.path;

    if (!filePaths.has(primaryPath)) {
      throw new Error(`Invalid FileSelection: primary file "${primaryPath}" not in files array`);
    }

    validatedPrimary = validatedFiles.find((f) => f.path === primaryPath);
  }

  // Return as branded validated type with module-level symbol
  return Object.freeze({
    __brand: VALIDATED_SELECTION_BRAND,
    files: Object.freeze(validatedFiles),
    primary: validatedPrimary,
  }) as ValidatedFileSelection;
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
