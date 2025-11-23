import type Icons from "@domain/data/Icons";

export enum FileType {
  // Directories
  DIRECTORY = "directory",

  // Text files
  TEXT = "txt",
  MARKDOWN = "md",
  JSON = "json",
  XML = "xml",

  // Code files
  JAVASCRIPT = "js",
  JSX = "jsx",
  TYPESCRIPT = "ts",
  TSX = "tsx",
  HTML = "html",
  CSS = "css",
  SCSS = "scss",
  PYTHON = "py",
  JAVA = "java",
  PHP = "php",
  CSHARP = "csharp",

  // Config files
  GITIGNORE = "gitignore",
  DOCKERFILE = "dockerfile",
  ENV = "env",

  // Media files
  PNG = "png",
  JPG = "jpg",
  JPEG = "jpeg",
  GIF = "gif",
  SVG = "svg",
  MP3 = "mp3",
  WAV = "wav",
  MP4 = "mp4",
  AVI = "avi",

  // Documents
  PDF = "pdf",
  DOC = "doc",
  DOCX = "docx",
  XLS = "xls",
  XLSX = "xlsx",

  // Archives
  ZIP = "zip",
  TAR = "tar",
  GZ = "gz",

  // Executables
  EXE = "exe",
  SH = "sh",
  BAT = "bat",

  // Default
  DEFAULT = "default",
}

export enum IconColor {
  YELLOW = "text-yellow-500",
  GRAY = "text-gray-400",
  BLUE = "text-blue-400",
  GREEN = "text-green-400",
  ORANGE = "text-orange-400",
  CYAN = "text-cyan-400",
  PINK = "text-pink-400",
  RED = "text-red-500",
  INDIGO = "text-indigo-500",
  PURPLE = "text-purple-500",
  BLUE_500 = "text-blue-500",
  BLUE_600 = "text-blue-600",
  GREEN_500 = "text-green-500",
  GREEN_600 = "text-green-600",
  YELLOW_600 = "text-yellow-600",
  RED_400 = "text-red-400",
  GRAY_500 = "text-gray-500",
  GRAY_600 = "text-gray-600",
  PURPLE_400 = "text-purple-400",
}

export interface FileIconConfig {
  icon: Icons | string;
  color: IconColor;
  model?: string; // 3D model path
  isDirectory: boolean;
}

export const FILE_TYPE_ICONS: Record<FileType, FileIconConfig> = {
  // Directories
  [FileType.DIRECTORY]: {
    icon: "folder",
    color: IconColor.YELLOW,
    isDirectory: true,
  },

  // Text files
  [FileType.TEXT]: { icon: "file", color: IconColor.GRAY, isDirectory: false },
  [FileType.MARKDOWN]: { icon: "file", color: IconColor.BLUE, isDirectory: false },
  [FileType.JSON]: { icon: "code", color: IconColor.GREEN, isDirectory: false },
  [FileType.XML]: { icon: "code", color: IconColor.ORANGE, isDirectory: false },

  // Code files
  [FileType.JAVASCRIPT]: { icon: "javascript", color: IconColor.YELLOW, isDirectory: false },
  [FileType.JSX]: { icon: "react", color: IconColor.CYAN, isDirectory: false },
  [FileType.TYPESCRIPT]: { icon: "typescript", color: IconColor.BLUE_500, isDirectory: false },
  [FileType.TSX]: { icon: "react", color: IconColor.BLUE_500, isDirectory: false },
  [FileType.HTML]: { icon: "code", color: IconColor.ORANGE, isDirectory: false },
  [FileType.CSS]: { icon: "code", color: IconColor.BLUE, isDirectory: false },
  [FileType.SCSS]: { icon: "code", color: IconColor.PINK, isDirectory: false },
  [FileType.PYTHON]: { icon: "python", color: IconColor.GREEN_500, isDirectory: false },
  [FileType.JAVA]: { icon: "java", color: IconColor.RED, isDirectory: false },
  [FileType.PHP]: { icon: "php", color: IconColor.INDIGO, isDirectory: false },
  [FileType.CSHARP]: { icon: "csharp", color: IconColor.PURPLE, isDirectory: false },

  // Config files
  [FileType.GITIGNORE]: { icon: "github", color: IconColor.GRAY_500, isDirectory: false },
  [FileType.DOCKERFILE]: { icon: "docker", color: IconColor.BLUE_500, isDirectory: false },
  [FileType.ENV]: { icon: "file", color: IconColor.GRAY_600, isDirectory: false },

  // Media files
  [FileType.PNG]: { icon: "image", color: IconColor.GREEN, isDirectory: false },
  [FileType.JPG]: { icon: "image", color: IconColor.GREEN, isDirectory: false },
  [FileType.JPEG]: { icon: "image", color: IconColor.GREEN, isDirectory: false },
  [FileType.GIF]: { icon: "image", color: IconColor.GREEN, isDirectory: false },
  [FileType.SVG]: { icon: "image", color: IconColor.GREEN, isDirectory: false },
  [FileType.MP3]: { icon: "music", color: IconColor.PURPLE_400, isDirectory: false },
  [FileType.WAV]: { icon: "music", color: IconColor.PURPLE_400, isDirectory: false },
  [FileType.MP4]: { icon: "video", color: IconColor.RED_400, isDirectory: false },
  [FileType.AVI]: { icon: "video", color: IconColor.RED_400, isDirectory: false },

  // Documents
  [FileType.PDF]: { icon: "file", color: IconColor.RED, isDirectory: false },
  [FileType.DOC]: { icon: "file", color: IconColor.BLUE_600, isDirectory: false },
  [FileType.DOCX]: { icon: "file", color: IconColor.BLUE_600, isDirectory: false },
  [FileType.XLS]: { icon: "file", color: IconColor.GREEN_600, isDirectory: false },
  [FileType.XLSX]: { icon: "file", color: IconColor.GREEN_600, isDirectory: false },

  // Archives
  [FileType.ZIP]: { icon: "file", color: IconColor.YELLOW_600, isDirectory: false },
  [FileType.TAR]: { icon: "file", color: IconColor.YELLOW_600, isDirectory: false },
  [FileType.GZ]: { icon: "file", color: IconColor.YELLOW_600, isDirectory: false },

  // Executables
  [FileType.EXE]: { icon: "terminal", color: IconColor.GRAY, isDirectory: false },
  [FileType.SH]: { icon: "terminal", color: IconColor.GRAY, isDirectory: false },
  [FileType.BAT]: { icon: "terminal", color: IconColor.GRAY, isDirectory: false },

  // Default
  [FileType.DEFAULT]: { icon: "file", color: IconColor.GRAY, isDirectory: false },
};

export function getFileIconConfig(fileName: string, isDirectory: boolean): FileIconConfig {
  if (isDirectory) {
    return FILE_TYPE_ICONS[FileType.DIRECTORY];
  }

  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const baseName = fileName.split(".").shift()?.toLowerCase() || "";

  // Check for exact filename matches first (like .gitignore)
  const baseFileType = baseName as FileType;
  if (Object.values(FileType).includes(baseFileType) && FILE_TYPE_ICONS[baseFileType]) {
    return FILE_TYPE_ICONS[baseFileType];
  }

  // Then check for extension matches
  const extensionFileType = extension as FileType;
  if (Object.values(FileType).includes(extensionFileType) && FILE_TYPE_ICONS[extensionFileType]) {
    return FILE_TYPE_ICONS[extensionFileType];
  }

  // Fallback to default
  return FILE_TYPE_ICONS[FileType.DEFAULT];
}

export function getFileIconPath(fileName: string, isDirectory: boolean): string {
  const config = getFileIconConfig(fileName, isDirectory);

  // If we have a 3D model for this file type, use it
  if (config.model) {
    return config.model;
  }

  // For directories, use a folder icon
  if (isDirectory) {
    return "/models/icons/folder.glb";
  }

  // Default file icon
  return "/models/icons/file.glb";
}
