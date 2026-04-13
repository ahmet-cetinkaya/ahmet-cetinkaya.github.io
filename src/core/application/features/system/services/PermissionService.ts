import { PathSanitizer } from "@application/features/fileExplorer/utils/InputSanitizer";
import { Paths } from "@domain/data/Directories";

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
  private static readonly READ_ONLY_PREFIXES = [`${Paths.USER_HOME}/Code` as string];
  private static readonly ALLOWED_PATH_PREFIXES = [Paths.USER_HOME as string];

  static canModifyPath(path: string): boolean {
    const isAllowed = this.ALLOWED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
    const isReadOnly = this.READ_ONLY_PREFIXES.some((prefix) => path.startsWith(prefix));
    return isAllowed && !isReadOnly;
  }

  static validatePath(path: string, permissionLevel: PermissionLevel = PermissionLevel.WRITE): void {
    const normalizedPath = PathSanitizer.normalizePath(path);

    if (permissionLevel === PermissionLevel.WRITE) {
      if (!this.canModifyPath(normalizedPath)) {
        throw PermissionError.denied(normalizedPath);
      }
      if (this.isProtectedPath(normalizedPath)) {
        throw PermissionError.denied(normalizedPath, "write to protected path");
      }
    }

    if (permissionLevel === PermissionLevel.READ && this.isProtectedPath(normalizedPath)) {
      throw PermissionError.denied(normalizedPath, "read protected path");
    }
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
