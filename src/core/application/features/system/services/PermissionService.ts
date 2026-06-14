import { PATH_CONSTANTS } from "@application/features/fileExplorer/constants/paths";
import { PathSanitizer } from "@application/features/fileExplorer/utils/PathSanitizer";
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
  private static readonly PROTECTED_PATHS = PATH_CONSTANTS.FORBIDDEN_PATHS;
  private static readonly READ_ONLY_PATHS = PATH_CONSTANTS.READ_ONLY_PATHS;
  private static readonly READ_ONLY_PREFIXES = [`${Paths.USER_HOME}/Code` as string];
  private static readonly ALLOWED_PATH_PREFIXES = [Paths.USER_HOME as string];

  static canModifyPath(path: string): boolean {
    const normalizedPath = PathSanitizer.normalizePath(path);
    const isAllowed = this.ALLOWED_PATH_PREFIXES.some(
      (prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`),
    );
    const isReadOnly = this.READ_ONLY_PREFIXES.some(
      (prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`),
    );
    return isAllowed && !isReadOnly;
  }

  static validatePath(path: string, permissionLevel: PermissionLevel = PermissionLevel.WRITE): void {
    if (permissionLevel === PermissionLevel.WRITE) {
      if (!this.canModifyPath(path)) {
        const normalizedPath = PathSanitizer.normalizePath(path);
        throw PermissionError.denied(normalizedPath);
      }
      const normalizedPath = PathSanitizer.normalizePath(path);
      if (this.isProtectedPath(normalizedPath)) {
        throw PermissionError.denied(normalizedPath, "write to protected path");
      }
    }

    if (permissionLevel === PermissionLevel.READ) {
      const normalizedPath = PathSanitizer.normalizePath(path);
      if (this.isProtectedPath(normalizedPath)) {
        throw PermissionError.denied(normalizedPath, "read protected path");
      }
    }
  }

  static validatePaths(paths: string[], permissionLevel: PermissionLevel = PermissionLevel.WRITE): void {
    for (const path of paths) {
      this.validatePath(path, permissionLevel);
    }
  }

  static validatePathOperation(operation: string, path: string): void {
    try {
      // Path operations (like create, delete, rename) require write permissions
      this.validatePath(path, PermissionLevel.WRITE);
    } catch (error) {
      if (error instanceof PermissionError) {
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
