import Icons from "@domain/data/Icons";
import { CACHE_CONFIG, FILE_TYPE_PATTERNS } from "../constants";

const iconConfigCache = new Map<string, FileIconConfig>();
const iconPathCache = new Map<string, string>();

function cleanupCache<T>(cache: Map<string, T>, maxSize: number): void {
  if (cache.size > maxSize) {
    const entriesToDelete = Math.floor(maxSize * 0.25);
    const keys = Array.from(cache.keys()).slice(0, entriesToDelete);
    keys.forEach((key) => cache.delete(key));
  }
}

export enum FileType {
  DIRECTORY = "directory",

  TEXT = "txt",
  MARKDOWN = "md",
  JSON = "json",
  XML = "xml",

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

  GITIGNORE = "gitignore",
  DOCKERFILE = "dockerfile",
  ENV = "env",

  PNG = "png",
  JPG = "jpg",
  JPEG = "jpeg",
  GIF = "gif",
  SVG = "svg",
  MP3 = "mp3",
  WAV = "wav",
  MP4 = "mp4",
  AVI = "avi",

  PDF = "pdf",
  DOC = "doc",
  DOCX = "docx",
  XLS = "xls",
  XLSX = "xlsx",

  ZIP = "zip",
  TAR = "tar",
  GZ = "gz",

  EXE = "exe",
  SH = "sh",
  BAT = "bat",

  JSDOS = "jsdos",
  GAME = "game",

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
  model?: string;
  isDirectory: boolean;
}

/**
 * Factory for creating FileIconConfig with validation
 */
export function createFileIconConfig(data: {
  icon: Icons | string;
  color: IconColor;
  model?: string;
  isDirectory: boolean;
}): FileIconConfig {
  // Validate icon is a valid Icons value or non-empty string
  if (!data.icon || (typeof data.icon === "string" && !data.icon.trim())) {
    throw new Error("Invalid FileIconConfig: icon must be a non-empty string");
  }

  // Validate color is a valid IconColor value
  if (!Object.values(IconColor).includes(data.color)) {
    throw new Error(`Invalid FileIconConfig: color must be a valid IconColor, got "${data.color}"`);
  }

  return data;
}

export const FILE_TYPE_ICONS: Record<FileType, FileIconConfig> = {
  [FileType.DIRECTORY]: {
    icon: Icons.folder,
    color: IconColor.YELLOW,
    isDirectory: true,
  },

  [FileType.TEXT]: { icon: Icons.file, color: IconColor.GRAY, isDirectory: false },
  [FileType.MARKDOWN]: { icon: Icons.file, color: IconColor.BLUE, isDirectory: false },
  [FileType.JSON]: { icon: Icons.code, color: IconColor.GREEN, isDirectory: false },
  [FileType.XML]: { icon: Icons.code, color: IconColor.ORANGE, isDirectory: false },

  [FileType.JAVASCRIPT]: { icon: Icons.javascript, color: IconColor.YELLOW, isDirectory: false },
  [FileType.JSX]: { icon: Icons.react, color: IconColor.CYAN, isDirectory: false },
  [FileType.TYPESCRIPT]: { icon: Icons.typescript, color: IconColor.BLUE_500, isDirectory: false },
  [FileType.TSX]: { icon: Icons.react, color: IconColor.BLUE_500, isDirectory: false },
  [FileType.HTML]: { icon: Icons.code, color: IconColor.ORANGE, isDirectory: false },
  [FileType.CSS]: { icon: Icons.code, color: IconColor.BLUE, isDirectory: false },
  [FileType.SCSS]: { icon: Icons.code, color: IconColor.PINK, isDirectory: false },
  [FileType.PYTHON]: { icon: Icons.python, color: IconColor.GREEN_500, isDirectory: false },
  [FileType.JAVA]: { icon: Icons.java, color: IconColor.RED, isDirectory: false },
  [FileType.PHP]: { icon: Icons.php, color: IconColor.INDIGO, isDirectory: false },
  [FileType.CSHARP]: { icon: Icons.csharp, color: IconColor.PURPLE, isDirectory: false },

  [FileType.GITIGNORE]: { icon: Icons.github, color: IconColor.GRAY_500, isDirectory: false },
  [FileType.DOCKERFILE]: { icon: Icons.docker, color: IconColor.BLUE_500, isDirectory: false },
  [FileType.ENV]: { icon: Icons.file, color: IconColor.GRAY_600, isDirectory: false },

  [FileType.PNG]: { icon: Icons.image, color: IconColor.GREEN, isDirectory: false },
  [FileType.JPG]: { icon: Icons.image, color: IconColor.GREEN, isDirectory: false },
  [FileType.JPEG]: { icon: Icons.image, color: IconColor.GREEN, isDirectory: false },
  [FileType.GIF]: { icon: Icons.image, color: IconColor.GREEN, isDirectory: false },
  [FileType.SVG]: { icon: Icons.image, color: IconColor.GREEN, isDirectory: false },
  [FileType.MP3]: { icon: Icons.music, color: IconColor.PURPLE_400, isDirectory: false },
  [FileType.WAV]: { icon: Icons.music, color: IconColor.PURPLE_400, isDirectory: false },
  [FileType.MP4]: { icon: Icons.video, color: IconColor.RED_400, isDirectory: false },
  [FileType.AVI]: { icon: Icons.video, color: IconColor.RED_400, isDirectory: false },

  [FileType.PDF]: { icon: Icons.pdf, color: IconColor.RED, isDirectory: false },
  [FileType.DOC]: { icon: Icons.file, color: IconColor.BLUE_600, isDirectory: false },
  [FileType.DOCX]: { icon: Icons.file, color: IconColor.BLUE_600, isDirectory: false },
  [FileType.XLS]: { icon: Icons.spreadsheet, color: IconColor.GREEN_600, isDirectory: false },
  [FileType.XLSX]: { icon: Icons.spreadsheet, color: IconColor.GREEN_600, isDirectory: false },

  [FileType.ZIP]: { icon: Icons.archive, color: IconColor.YELLOW_600, isDirectory: false },
  [FileType.TAR]: { icon: Icons.archive, color: IconColor.YELLOW_600, isDirectory: false },
  [FileType.GZ]: { icon: Icons.archive, color: IconColor.YELLOW_600, isDirectory: false },

  [FileType.EXE]: { icon: Icons.terminal, color: IconColor.GRAY, isDirectory: false },
  [FileType.SH]: { icon: Icons.terminal, color: IconColor.GRAY, isDirectory: false },
  [FileType.BAT]: { icon: Icons.terminal, color: IconColor.GRAY, isDirectory: false },

  [FileType.JSDOS]: { icon: Icons.doom, color: IconColor.RED_400, isDirectory: false },
  [FileType.GAME]: { icon: Icons.godotEngine, color: IconColor.PURPLE_400, isDirectory: false },

  [FileType.DEFAULT]: { icon: Icons.file, color: IconColor.GRAY, isDirectory: false },
};

export function getFileIconConfig(fileName: string, isDirectory: boolean): FileIconConfig {
  const cacheKey = `${fileName}:${isDirectory}`;

  if (iconConfigCache.has(cacheKey)) {
    return iconConfigCache.get(cacheKey)!;
  }

  let config: FileIconConfig;

  if (isDirectory) {
    config = FILE_TYPE_ICONS[FileType.DIRECTORY];
  } else {
    config = determineFileIconConfig(fileName);
  }

  iconConfigCache.set(cacheKey, config);
  cleanupCache(iconConfigCache, CACHE_CONFIG.ICON_CACHE_SIZE);

  return config;
}

function determineFileIconConfig(fileName: string): FileIconConfig {
  const lowerFileName = fileName.toLowerCase();

  const exactFileNameMap: Record<string, FileType> = {
    dockerfile: FileType.DOCKERFILE,
    ".gitignore": FileType.GITIGNORE,
    ".env": FileType.ENV,
    "doom.jsdos": FileType.JSDOS,
  };

  if (exactFileNameMap[lowerFileName]) {
    return FILE_TYPE_ICONS[exactFileNameMap[lowerFileName]];
  }

  if (lowerFileName.startsWith(".")) {
    const dotfileName = lowerFileName.substring(1);
    if (exactFileNameMap[dotfileName]) {
      return FILE_TYPE_ICONS[exactFileNameMap[dotfileName]];
    }
  }

  if (FILE_TYPE_PATTERNS.IMAGES.test(fileName)) {
    const ext = lowerFileName.split(".").pop();
    const imageFileType = ext as FileType;
    if (FILE_TYPE_ICONS[imageFileType]) {
      return FILE_TYPE_ICONS[imageFileType];
    }
    return FILE_TYPE_ICONS[FileType.PNG];
  }

  if (FILE_TYPE_PATTERNS.VIDEOS.test(fileName)) {
    const ext = lowerFileName.split(".").pop();
    const videoFileType = ext as FileType;
    if (FILE_TYPE_ICONS[videoFileType]) {
      return FILE_TYPE_ICONS[videoFileType];
    }
    return FILE_TYPE_ICONS[FileType.MP4];
  }

  if (FILE_TYPE_PATTERNS.AUDIO.test(fileName)) {
    const ext = lowerFileName.split(".").pop();
    const audioFileType = ext as FileType;
    if (FILE_TYPE_ICONS[audioFileType]) {
      return FILE_TYPE_ICONS[audioFileType];
    }
    return FILE_TYPE_ICONS[FileType.MP3];
  }

  if (FILE_TYPE_PATTERNS.DOCUMENTS.test(fileName)) {
    if (fileName.toLowerCase().endsWith(".pdf")) return FILE_TYPE_ICONS[FileType.PDF];
    if (fileName.toLowerCase().endsWith(".docx") || fileName.toLowerCase().endsWith(".doc"))
      return FILE_TYPE_ICONS[FileType.DOCX];
    if (fileName.toLowerCase().endsWith(".xlsx") || fileName.toLowerCase().endsWith(".xls"))
      return FILE_TYPE_ICONS[FileType.XLSX];
    return FILE_TYPE_ICONS[FileType.PDF];
  }

  if (FILE_TYPE_PATTERNS.ARCHIVES.test(fileName)) {
    return FILE_TYPE_ICONS[FileType.ZIP];
  }

  if (FILE_TYPE_PATTERNS.CODE.test(fileName)) {
    const ext = lowerFileName.split(".").pop();
    const codeFileType = ext as FileType;
    if (FILE_TYPE_ICONS[codeFileType]) {
      return FILE_TYPE_ICONS[codeFileType];
    }
    return FILE_TYPE_ICONS[FileType.JAVASCRIPT];
  }

  if (FILE_TYPE_PATTERNS.CONFIG.test(fileName)) {
    return FILE_TYPE_ICONS[FileType.ENV];
  }

  const extension = lowerFileName.split(".").pop() || "";

  if (extension === "jsdos") {
    return FILE_TYPE_ICONS[FileType.JSDOS];
  }

  if (Object.values(FileType).includes(extension as FileType) && FILE_TYPE_ICONS[extension as FileType]) {
    return FILE_TYPE_ICONS[extension as FileType];
  }

  return FILE_TYPE_ICONS[FileType.DEFAULT];
}

export function getFileIconPath(fileName: string, isDirectory: boolean): string {
  const cacheKey = `${fileName}:${isDirectory}:path`;

  if (iconPathCache.has(cacheKey)) {
    return iconPathCache.get(cacheKey)!;
  }

  const config = getFileIconConfig(fileName, isDirectory);
  let iconPath: string;

  if (config.model) {
    iconPath = config.model;
  } else if (isDirectory) {
    iconPath = "/models/icons/folder.glb";
  } else {
    iconPath = "/models/icons/file.glb";
  }

  iconPathCache.set(cacheKey, iconPath);
  cleanupCache(iconPathCache, CACHE_CONFIG.ICON_CACHE_SIZE);

  return iconPath;
}

export function clearIconCaches(): void {
  iconConfigCache.clear();
  iconPathCache.clear();
}

export function getIconCacheStats(): { configCacheSize: number; pathCacheSize: number } {
  return {
    configCacheSize: iconConfigCache.size,
    pathCacheSize: iconPathCache.size,
  };
}
