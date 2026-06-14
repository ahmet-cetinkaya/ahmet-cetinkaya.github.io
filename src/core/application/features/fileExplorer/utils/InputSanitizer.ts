import PermissionService, { PermissionLevel } from "@application/features/system/services/PermissionService";
import { InvalidFilenameError, InvalidPathError } from "../errors";
import { PathSanitizer } from "./PathSanitizer";

export { PathSanitizer } from "./PathSanitizer";

/**
 * Consolidated validation utilities to reduce code duplication
 */
export class ValidationHelper {
  /**
   * Validate both path format and permissions in one call
   */
  static validatePathWithPermissions(path: string, permissionLevel: PermissionLevel = PermissionLevel.WRITE): void {
    PathSanitizer.validatePath(path);
    PermissionService.validatePath(path, permissionLevel);
  }

  /**
   * Validate path for read operations (navigation, listing contents)
   */
  static validatePathForReading(path: string): void {
    PathSanitizer.validatePath(path);
    PermissionService.validatePathRead(path);
  }

  /**
   * Validate path for write operations (create, delete, modify)
   */
  static validatePathForWriting(path: string): void {
    PathSanitizer.validatePath(path);
    PermissionService.validatePathWrite(path);
  }

  /**
   * Validate multiple paths at once
   */
  static validatePathsWithPermissions(paths: string[], permissionLevel: PermissionLevel = PermissionLevel.WRITE): void {
    for (const path of paths) {
      this.validatePathWithPermissions(path, permissionLevel);
    }
  }

  /**
   * Sanitize filename and validate parent path permissions
   */
  static sanitizeFileNameAndValidateParent(
    parentPath: string,
    fileName: string,
  ): {
    sanitizedName: string;
    fullPath: string;
  } {
    const sanitizedName = PathSanitizer.sanitizeFileName(fileName);
    const fullPath = PathSanitizer.joinPath(parentPath, sanitizedName);

    // Validate both parent path and resulting full path for writing
    this.validatePathForReading(parentPath);
    this.validatePathForWriting(fullPath);

    return { sanitizedName, fullPath };
  }

  /**
   * Validate and prepare file operation inputs
   */
  static validateFileOperation(
    parentPath: string,
    name: string,
    operation: "create" | "rename" | "copy" | "move" = "create",
  ): {
    validatedParentPath: string;
    sanitizedName: string;
    fullPath: string;
  } {
    // Validate parent path for reading and full path for writing
    this.validatePathForReading(parentPath);

    // Sanitize the name
    const sanitizedName = PathSanitizer.sanitizeFileName(name);

    // Additional validation for rename operations
    if (operation === "rename" && !sanitizedName.trim()) {
      throw new InvalidFilenameError(name, "Name cannot be empty after sanitization");
    }

    // Construct and validate full path
    const fullPath = PathSanitizer.joinPath(parentPath, sanitizedName);

    return {
      validatedParentPath: parentPath,
      sanitizedName,
      fullPath,
    };
  }

  /**
   * Validate operation paths (source and destination)
   */
  static validateOperationPaths(
    sourcePaths: string[],
    destinationPath: string,
  ): {
    validatedSources: string[];
    validatedDestination: string;
  } {
    // Validate all source paths for reading
    this.validatePathsWithPermissions(sourcePaths, PermissionLevel.READ);

    // Validate destination path for writing
    this.validatePathForWriting(destinationPath);

    return {
      validatedSources: [...sourcePaths],
      validatedDestination: destinationPath,
    };
  }

  /**
   * Check for self-referencing operations (moving directory into itself)
   */
  static validateSelfReference(sourcePath: string, destinationPath: string): void {
    if (destinationPath.startsWith(`${sourcePath}/`) || destinationPath === sourcePath) {
      throw new InvalidPathError(
        `${sourcePath} -> ${destinationPath}`,
        "Cannot move directory into itself or its subdirectory",
      );
    }
  }
}

/**
 * String sanitization for user input
 */
export class StringSanitizer {
  /**
   * Sanitize user input for display
   */
  static forDisplay(input: string): string {
    if (!input || typeof input !== "string") {
      return "";
    }

    return input
      .replace(/[<>]/g, "") // Remove HTML tags
      .trim()
      .substring(0, 1000); // Limit length
  }

  /**
   * Sanitize input for logging
   */
  static forLogging(input: string): string {
    if (!input || typeof input !== "string") {
      return "";
    }

    return input
      .replace(/[\n\r\t]/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .trim()
      .substring(0, 500); // Limit length for logs
  }

  /**
   * Sanitize input for file content
   */
  static forFileContent(input: string): string {
    if (!input || typeof input !== "string") {
      return "";
    }

    // Remove null bytes and control characters except newlines and tabs
    /* eslint-disable-next-line no-control-regex */
    const contentControlChars = new RegExp("[\\x00-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]", "g");
    return input.replace(contentControlChars, "");
  }
}
