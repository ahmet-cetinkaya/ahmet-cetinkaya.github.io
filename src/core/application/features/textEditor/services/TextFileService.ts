import { PathSanitizer } from "@application/features/fileExplorer/utils/PathSanitizer";
import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import { Paths } from "@domain/data/Directories";
import File from "@domain/models/File";

export type EditorLanguage =
  | "javascript"
  | "typescript"
  | "jsx"
  | "tsx"
  | "json"
  | "markdown"
  | "html"
  | "css"
  | "xml"
  | "python"
  | "rust"
  | "cpp"
  | "c"
  | "java"
  | "php"
  | "sql"
  | "go"
  | "yaml"
  | "shell"
  | "toml"
  | "ini"
  | "ruby"
  | "lua"
  | "swift"
  | "dockerfile"
  | "powershell"
  | "dart"
  | "csharp"
  | "kotlin"
  | "scala"
  | "cmake"
  | "groovy"
  | "plaintext";

const TEXT_EXTENSIONS = new Set([
  "txt",
  "md",
  "markdown",
  "ts",
  "tsx",
  "js",
  "jsx",
  "mjs",
  "cjs",
  "json",
  "html",
  "htm",
  "css",
  "scss",
  "sh",
  "bash",
  "zsh",
  "yml",
  "yaml",
  "xml",
  "toml",
  "ini",
  "conf",
  "log",
  "desktop",
  "gitconfig",
  "bashrc",
  "env",
  "py",
  "pyw",
  "rs",
  "c",
  "h",
  "cpp",
  "cc",
  "cxx",
  "hpp",
  "hh",
  "java",
  "php",
  "sql",
  "go",
  "rb",
  "lua",
  "swift",
  "dockerfile",
  "ps1",
  "psm1",
  "fish",
  "properties",
  "dart",
  "cs",
  "kt",
  "kts",
  "scala",
  "sc",
  "cmake",
  "gradle",
  "groovy",
  "mdx",
  "astro",
  "vue",
  "svelte",
]);

const BINARY_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "ico",
  "mp3",
  "wav",
  "ogg",
  "flac",
  "mp4",
  "webm",
  "mov",
  "avi",
  "mkv",
  "pdf",
  "zip",
  "tar",
  "gz",
  "rar",
  "7z",
  "jsdos",
  "wasm",
  "ttf",
  "otf",
  "woff",
  "woff2",
]);

const LANGUAGE_BY_EXTENSION: Record<string, EditorLanguage> = {
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  json: "json",
  md: "markdown",
  markdown: "markdown",
  html: "html",
  htm: "html",
  css: "css",
  scss: "css",
  xml: "xml",
  py: "python",
  pyw: "python",
  rs: "rust",
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  hpp: "cpp",
  hh: "cpp",
  java: "java",
  php: "php",
  sql: "sql",
  go: "go",
  yml: "yaml",
  yaml: "yaml",
  toml: "toml",
  ini: "ini",
  conf: "ini",
  properties: "ini",
  gitconfig: "ini",
  rb: "ruby",
  lua: "lua",
  swift: "swift",
  dockerfile: "dockerfile",
  ps1: "powershell",
  psm1: "powershell",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  fish: "shell",
  bashrc: "shell",
  dart: "dart",
  cs: "csharp",
  kt: "kotlin",
  kts: "kotlin",
  scala: "scala",
  sc: "scala",
  cmake: "cmake",
  gradle: "groovy",
  groovy: "groovy",
  mdx: "markdown",
  astro: "html",
  vue: "html",
  svelte: "html",
};

/**
 * Encapsulates text-file concerns for the Text Editor: classification (text vs binary),
 * read-only detection, content read/write, and language detection for syntax highlighting.
 */
export default class TextFileService {
  constructor(private readonly fileSystemService: IFileSystemService) {}

  isTextFile(entry: FileSystemEntry): boolean {
    if (!(entry instanceof File)) return false;
    if (this.isBinaryOrMedia(entry)) return false;

    const extension = this.getExtension(entry.name);
    if (extension === "") {
      // Extensionless files (e.g. dotfiles like ".bashrc" yield extension "bashrc") are treated as text.
      return true;
    }
    return TEXT_EXTENSIONS.has(extension);
  }

  isBinaryOrMedia(entry: FileSystemEntry): boolean {
    if (!(entry instanceof File)) return false;
    return BINARY_EXTENSIONS.has(this.getExtension(entry.name));
  }

  isReadOnly(path: string): boolean {
    const codePath = PathSanitizer.normalizePath(`${Paths.USER_HOME}/Code`);
    const normalizedPath = PathSanitizer.normalizePath(path);
    return normalizedPath === codePath || normalizedPath.startsWith(`${codePath}/`);
  }

  async readContent(path: string): Promise<string> {
    return this.fileSystemService.readFileContent(path);
  }

  async saveContent(path: string, content: string): Promise<void> {
    if (this.isReadOnly(path)) {
      throw new Error(`Cannot save read-only file: ${path}`);
    }

    const entry = await this.fileSystemService.get((e) => e.fullPath === path);
    if (!entry || !(entry instanceof File)) {
      throw new Error(`File not found: ${path}`);
    }

    await this.fileSystemService.update(this.createFile(path, content, entry.createdDate));
  }

  async saveToDirectory(directoryPath: string, fileName: string, content: string): Promise<string> {
    PathSanitizer.validatePath(directoryPath);
    if (!this.isDirectoryWritable(directoryPath)) {
      throw new Error(`Cannot save into read-only directory: ${directoryPath}`);
    }

    const sanitizedName = this.validateNewFileName(fileName);
    const path = PathSanitizer.joinPath(directoryPath, sanitizedName);
    const entry = await this.fileSystemService.get((e) => e.fullPath === path);

    if (entry) {
      if (!(entry instanceof File)) {
        throw new Error(`File not found: ${path}`);
      }
      await this.saveContent(path, content);
      return path;
    }

    await this.fileSystemService.add(this.createFile(path, content));
    return path;
  }

  isDirectoryWritable(path: string): boolean {
    return !this.isReadOnly(path);
  }

  isValidFileName(fileName: string): boolean {
    try {
      this.validateNewFileName(fileName);
      return true;
    } catch {
      return false;
    }
  }

  async listDirectory(path: string, options: { textOnly: boolean }): Promise<FileSystemEntry[]> {
    const entries = await this.fileSystemService.getChildren(path);
    const filtered = options.textOnly
      ? entries.filter((entry) => !(entry instanceof File) || this.isTextFile(entry))
      : entries;

    return filtered.sort((left, right) => {
      const leftIsFile = left instanceof File;
      const rightIsFile = right instanceof File;
      if (leftIsFile !== rightIsFile) return leftIsFile ? 1 : -1;
      return left.name.localeCompare(right.name);
    });
  }

  getLanguageForExtension(fileName: string): EditorLanguage {
    const extension = this.getExtension(fileName);
    return LANGUAGE_BY_EXTENSION[extension] ?? "plaintext";
  }

  private getExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex <= 0 || lastDotIndex === fileName.length - 1) {
      // No dot, leading dot (dotfile with no further extension handled by caller), or trailing dot.
      if (lastDotIndex === 0) return fileName.slice(1).toLowerCase();
      return "";
    }
    return fileName.slice(lastDotIndex + 1).toLowerCase();
  }

  private validateNewFileName(fileName: string): string {
    const trimmedName = fileName.trim();
    if (!trimmedName) {
      throw new Error("Filename cannot be empty");
    }
    if (trimmedName.includes("..") || trimmedName.includes("/") || trimmedName.includes("\\")) {
      throw new Error(`Invalid filename: ${fileName}`);
    }

    const sanitizedName = PathSanitizer.sanitizeFileName(trimmedName);
    if (sanitizedName !== trimmedName) {
      throw new Error(`Invalid filename: ${fileName}`);
    }
    return sanitizedName;
  }

  private createFile(path: string, content: string, createdDate = new Date()): File {
    const contentBytes = new TextEncoder().encode(content).length;
    return new File(path, content, createdDate, contentBytes, new Date());
  }
}
