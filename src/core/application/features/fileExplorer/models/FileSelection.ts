export interface SelectedFile {
  path: string;
  name: string;
  type: "file" | "directory";
  size?: number;
  extension?: string;
}

export interface FileSelection {
  files: SelectedFile[];
  primary?: SelectedFile;
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
