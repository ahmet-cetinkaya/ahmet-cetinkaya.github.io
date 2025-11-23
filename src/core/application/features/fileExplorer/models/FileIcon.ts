import type Icons from "@domain/data/Icons";

export interface FileIconConfig {
  icon: Icons | string;
  color: string;
  model?: string; // 3D model path
  isDirectory: boolean;
}

export const FILE_TYPE_ICONS: Record<string, FileIconConfig> = {
  // Directories
  directory: {
    icon: "folder",
    color: "text-yellow-500",
    isDirectory: true,
  },

  // Text files
  txt: { icon: "file", color: "text-gray-400", isDirectory: false },
  md: { icon: "file", color: "text-blue-400", isDirectory: false },
  json: { icon: "code", color: "text-green-400", isDirectory: false },
  xml: { icon: "code", color: "text-orange-400", isDirectory: false },

  // Code files
  js: { icon: "javascript", color: "text-yellow-400", isDirectory: false },
  jsx: { icon: "react", color: "text-cyan-400", isDirectory: false },
  ts: { icon: "typescript", color: "text-blue-500", isDirectory: false },
  tsx: { icon: "react", color: "text-blue-500", isDirectory: false },
  html: { icon: "code", color: "text-orange-500", isDirectory: false },
  css: { icon: "code", color: "text-blue-400", isDirectory: false },
  scss: { icon: "code", color: "text-pink-400", isDirectory: false },
  py: { icon: "python", color: "text-green-500", isDirectory: false },
  java: { icon: "java", color: "text-red-500", isDirectory: false },
  php: { icon: "php", color: "text-indigo-500", isDirectory: false },
  csharp: { icon: "csharp", color: "text-purple-500", isDirectory: false },

  // Config files
  gitignore: { icon: "github", color: "text-gray-500", isDirectory: false },
  dockerfile: { icon: "docker", color: "text-blue-500", isDirectory: false },
  env: { icon: "file", color: "text-gray-600", isDirectory: false },

  // Media files
  png: { icon: "image", color: "text-green-400", isDirectory: false },
  jpg: { icon: "image", color: "text-green-400", isDirectory: false },
  jpeg: { icon: "image", color: "text-green-400", isDirectory: false },
  gif: { icon: "image", color: "text-green-400", isDirectory: false },
  svg: { icon: "image", color: "text-green-400", isDirectory: false },
  mp3: { icon: "music", color: "text-purple-400", isDirectory: false },
  wav: { icon: "music", color: "text-purple-400", isDirectory: false },
  mp4: { icon: "video", color: "text-red-400", isDirectory: false },
  avi: { icon: "video", color: "text-red-400", isDirectory: false },

  // Documents
  pdf: { icon: "file", color: "text-red-500", isDirectory: false },
  doc: { icon: "file", color: "text-blue-600", isDirectory: false },
  docx: { icon: "file", color: "text-blue-600", isDirectory: false },
  xls: { icon: "file", color: "text-green-600", isDirectory: false },
  xlsx: { icon: "file", color: "text-green-600", isDirectory: false },

  // Archives
  zip: { icon: "file", color: "text-yellow-600", isDirectory: false },
  tar: { icon: "file", color: "text-yellow-600", isDirectory: false },
  gz: { icon: "file", color: "text-yellow-600", isDirectory: false },

  // Executables
  exe: { icon: "terminal", color: "text-gray-400", isDirectory: false },
  sh: { icon: "terminal", color: "text-gray-400", isDirectory: false },
  bat: { icon: "terminal", color: "text-gray-400", isDirectory: false },

  // Default
  default: { icon: "file", color: "text-gray-400", isDirectory: false },
};

export function getFileIconConfig(fileName: string, isDirectory: boolean): FileIconConfig {
  if (isDirectory) {
    return FILE_TYPE_ICONS.directory;
  }

  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const baseName = fileName.split(".").shift()?.toLowerCase() || "";

  // Check for exact filename matches first (like .gitignore)
  if (FILE_TYPE_ICONS[baseName]) {
    return FILE_TYPE_ICONS[baseName];
  }

  // Then check for extension matches
  return FILE_TYPE_ICONS[extension] || FILE_TYPE_ICONS.default;
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
