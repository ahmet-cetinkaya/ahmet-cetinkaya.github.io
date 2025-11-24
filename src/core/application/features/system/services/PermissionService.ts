import { TranslationKeys } from "@domain/data/Translations";

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermissionError";
  }
}

export default class PermissionService {
  private static readonly PROTECTED_PATHS = [
    "/",
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
  private static readonly ALLOWED_PATH_PREFIXES = ["/home/ac"];

  static canModifyPath(path: string): boolean {
    return this.ALLOWED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
  }

  static validatePath(path: string): void {
    // First check if path is protected - this should always throw error
    if (this.isProtectedPath(path)) {
      throw new PermissionError(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${path}`);
    }

    // Then check if path is in allowed paths
    if (!this.canModifyPath(path)) {
      throw new PermissionError(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${path}`);
    }
  }

  static validatePaths(paths: string[]): void {
    for (const path of paths) {
      this.validatePath(path);
    }
  }

  static validatePathOperation(operation: string, path: string): void {
    try {
      this.validatePath(path);
    } catch (error) {
      if (error instanceof PermissionError) {
        throw new PermissionError(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${operation} ${path}`);
      }
      throw error;
    }
  }

  static isProtectedPath(path: string): boolean {
    return this.PROTECTED_PATHS.includes(path);
  }

  static getAllowedPaths(): string[] {
    return [...this.ALLOWED_PATH_PREFIXES];
  }

  static getProtectedPaths(): string[] {
    return [...this.PROTECTED_PATHS];
  }
}
