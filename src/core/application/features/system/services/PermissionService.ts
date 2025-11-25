import { TranslationKeys } from "@domain/data/Translations";
import { PathSanitizer } from "@application/features/fileExplorer/utils/InputSanitizer";

export class PermissionError extends Error {
  public readonly path: string;
  public readonly isPermissionError = true; // Type guard for easier checking

  constructor(message: string, path: string) {
    super(message);
    this.name = "PermissionError";
    this.path = path;
  }

  // Factory method for creating permission denied errors
  static denied(path: string, operation?: string): PermissionError {
    const normalizedPath = PathSanitizer.normalizePath(path);
    const message = operation ? `${operation}: ${normalizedPath}` : normalizedPath;
    return new PermissionError(message, normalizedPath);
  }
}

export enum PermissionLevel {
  READ = "read",
  WRITE = "write",
}

export default class PermissionService {
  private static readonly PROTECTED_PATHS = [
    "/bin",
    "/sbin",
    "/usr/bin",
    "/usr/sbin",
    "/etc",
    "/boot",
    "/dev",
    "/proc",
    "/sys",
    "/root",
    "/var",
    "/tmp",
    "/opt",
    "/usr/local",
  ];
  private static readonly READ_ONLY_PATHS = ["/"];
  private static readonly ALLOWED_PATH_PREFIXES = ["/home/ac"];

  static canModifyPath(path: string): boolean {
    return this.ALLOWED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
  }

  static validatePath(path: string, permissionLevel: PermissionLevel = PermissionLevel.WRITE): void {
    // Normalize the path to fix double slashes and other path issues
    const normalizedPath = PathSanitizer.normalizePath(path);

    // For write operations, check if path is in allowed paths
    if (permissionLevel === PermissionLevel.WRITE && !this.canModifyPath(normalizedPath)) {
      throw PermissionError.denied(normalizedPath);
    }

    // For read operations, allow access to all paths including protected ones
    // This allows users to browse system directories like /bin, /etc, /usr, etc.
  }

  static validatePaths(paths: string[], permissionLevel: PermissionLevel = PermissionLevel.WRITE): void {
    for (const path of paths) {
      this.validatePath(path, permissionLevel);
    }
  }

  static validatePathOperation(operation: string, path: string): void {
    try {
      // Normalize path first to fix any path issues
      const normalizedPath = PathSanitizer.normalizePath(path);

      // Path operations (like create, delete, rename) require write permissions
      this.validatePath(normalizedPath, PermissionLevel.WRITE);
    } catch (error) {
      if (error instanceof PermissionError) {
        // Normalize path for the error message too
        const normalizedPath = PathSanitizer.normalizePath(path);
        throw PermissionError.denied(normalizedPath, operation);
      }
      throw error;
    }
  }

  static validatePathRead(path: string): void {
    this.validatePath(path, PermissionLevel.READ);
  }

  static validatePathWrite(path: string): void {
    this.validatePath(path, PermissionLevel.WRITE);
  }

  static isProtectedPath(path: string): boolean {
    return this.PROTECTED_PATHS.includes(path);
  }

  static isReadOnlyPath(path: string): boolean {
    return this.READ_ONLY_PATHS.includes(path);
  }

  static getAllowedPaths(): string[] {
    return [...this.ALLOWED_PATH_PREFIXES];
  }

  static getProtectedPaths(): string[] {
    return [...this.PROTECTED_PATHS];
  }
}
