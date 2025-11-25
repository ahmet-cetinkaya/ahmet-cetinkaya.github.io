import PermissionService, { PermissionLevel } from "@application/features/system/services/PermissionService";
import { FILE_OPERATIONS, PATH_CONSTANTS } from "../constants";
import { InvalidFilenameError, InvalidPathError } from "../errors";

/**
 * Input sanitization utilities for enhanced security
 * Prevents path traversal, injection attacks, and invalid inputs
 */

/**
 * Sanitize and validate file paths
 */
export class PathSanitizer {
  /**
   * Validate a file path for security and format
   */
  static validatePath(path: string): void {
    if (!path || typeof path !== "string") {
      throw new InvalidPathError(path || "undefined", "Path must be a non-empty string");
    }

    // Check path length
    if (path.length > PATH_CONSTANTS.MAX_PATH_LENGTH) {
      throw new InvalidPathError(path, `Path exceeds maximum length of ${PATH_CONSTANTS.MAX_PATH_LENGTH}`);
    }

    // Normalize the path first
    const normalizedPath = this.normalizePath(path);

    // Check for forbidden path patterns
    this.checkForbiddenPaths(normalizedPath);

    // Check for path traversal attempts
    this.checkPathTraversal(normalizedPath);

    // Validate path format
    this.validatePathFormat(normalizedPath);
  }

  /**
   * Sanitize a file name
   */
  static sanitizeFileName(fileName: string): string {
    if (!fileName || typeof fileName !== "string") {
      throw new InvalidFilenameError(fileName || "undefined", "Filename must be a non-empty string");
    }

    // Check length
    if (fileName.length > FILE_OPERATIONS.MAX_FILENAME_LENGTH) {
      throw new InvalidFilenameError(
        fileName,
        `Filename exceeds maximum length of ${FILE_OPERATIONS.MAX_FILENAME_LENGTH}`,
      );
    }

    // Remove forbidden characters
    const sanitized = fileName.replace(FILE_OPERATIONS.FORBIDDEN_CHARACTERS, "_");

    // Check for reserved names (case-insensitive)
    const nameWithoutExt = sanitized.split(".")[0].toLowerCase();
    if (FILE_OPERATIONS.RESERVED_NAMES.includes(nameWithoutExt)) {
      throw new InvalidFilenameError(fileName, `"${nameWithoutExt}" is a reserved name`);
    }

    // Don't allow empty names after sanitization
    if (!sanitized.trim()) {
      throw new InvalidFilenameError(fileName, "Filename cannot be empty or only special characters");
    }

    // Don't allow names that are just dots
    if (/^\.+$/.test(sanitized)) {
      throw new InvalidFilenameError(fileName, "Filename cannot be only dots");
    }

    return sanitized;
  }

  /**
   * Normalize a path (resolve .. and . references)
   */
  static normalizePath(path: string): string {
    // Ensure path starts with /
    if (!path.startsWith(PATH_CONSTANTS.SEPARATOR)) {
      path = PATH_CONSTANTS.SEPARATOR + path;
    }

    // Split path into components
    const parts = path.split(PATH_CONSTANTS.SEPARATOR);

    // Filter out empty parts and resolve .. references
    const resolvedParts: string[] = [];
    for (const part of parts) {
      if (!part || part === PATH_CONSTANTS.CURRENT_DIR) {
        continue;
      }
      if (part === PATH_CONSTANTS.PARENT_DIR) {
        // Don't go above root
        if (resolvedParts.length > 0) {
          resolvedParts.pop();
        }
        continue;
      }
      resolvedParts.push(part);
    }

    // Reconstruct path
    const normalized = PATH_CONSTANTS.SEPARATOR + resolvedParts.join(PATH_CONSTANTS.SEPARATOR);

    return normalized || PATH_CONSTANTS.ROOT_PATH;
  }

  /**
   * Check if path contains forbidden directories
   */
  private static checkForbiddenPaths(path: string): void {
    const normalizedPath = path.toLowerCase();

    for (const forbiddenPath of PATH_CONSTANTS.FORBIDDEN_PATHS) {
      if (
        normalizedPath.startsWith(forbiddenPath.toLowerCase() + PATH_CONSTANTS.SEPARATOR) ||
        normalizedPath === forbiddenPath.toLowerCase()
      ) {
        throw new InvalidPathError(path, "SYSTEM_DIRECTORY_ACCESS", forbiddenPath);
      }
    }
  }

  /**
   * Check for path traversal attempts
   */
  private static checkPathTraversal(path: string): void {
    // Look for encoded traversal attempts
    const encodedTraversal = /%2e%2e|%2e%2e%2f|%2e%2e%5c/i;
    if (encodedTraversal.test(path)) {
      throw new InvalidPathError(path, "Path contains encoded traversal characters");
    }

    // Look for null bytes (potential attack vector)
    if (path.includes("\0")) {
      throw new InvalidPathError(path, "Path contains null bytes");
    }

    // Look for excessive directory depth
    const depth = path.split(PATH_CONSTANTS.SEPARATOR).filter(Boolean).length;
    if (depth > 100) {
      // Reasonable limit
      throw new InvalidPathError(path, `Path depth (${depth}) exceeds maximum allowed depth`);
    }
  }

  /**
   * Validate path format
   */
  private static validatePathFormat(path: string): void {
    // Check for invalid characters at start/end
    if (path !== PATH_CONSTANTS.ROOT_PATH && path.endsWith(PATH_CONSTANTS.SEPARATOR)) {
      throw new InvalidPathError(path, "Path cannot end with separator");
    }

    // Check for double separators
    if (path.includes(PATH_CONSTANTS.SEPARATOR + PATH_CONSTANTS.SEPARATOR)) {
      throw new InvalidPathError(path, "Path contains double separators");
    }

    // Check for invalid characters that might cause issues
    /* eslint-disable-next-line no-control-regex */
    const invalidChars = new RegExp('[<>:"|?*\\x00-\\x08\\x0b\\x0c\\x0e-\\x1f]');
    if (invalidChars.test(path)) {
      throw new InvalidPathError(path, "Path contains invalid characters");
    }
  }

  /**
   * Join path parts safely
   */
  static joinPath(basePath: string, fileName: string): string {
    // Validate inputs
    if (!basePath || typeof basePath !== "string") {
      throw new InvalidPathError(basePath || "undefined", "Base path must be a non-empty string");
    }
    if (!fileName || typeof fileName !== "string") {
      throw new InvalidFilenameError(fileName || "undefined", "Filename must be a non-empty string");
    }

    // Validate the base path
    this.validatePath(basePath);

    // Sanitize only the filename, not the path
    const sanitizedFileName = this.sanitizeFileName(fileName);

    // Normalize base path and ensure it doesn't end with separator
    const normalizedBasePath = this.normalizePath(basePath);
    const cleanBasePath =
      normalizedBasePath === PATH_CONSTANTS.ROOT_PATH ? PATH_CONSTANTS.ROOT_PATH : normalizedBasePath;

    // Join with separator
    const fullPath = cleanBasePath + PATH_CONSTANTS.SEPARATOR + sanitizedFileName;

    return fullPath;
  }

  /**
   * Get directory path from file path
   */
  static getDirectoryPath(filePath: string): string {
    this.validatePath(filePath);

    const lastSeparatorIndex = filePath.lastIndexOf(PATH_CONSTANTS.SEPARATOR);
    if (lastSeparatorIndex <= 0) {
      return PATH_CONSTANTS.ROOT_PATH;
    }

    return filePath.substring(0, lastSeparatorIndex);
  }

  /**
   * Get file name from path
   */
  static getFileName(filePath: string): string {
    this.validatePath(filePath);

    const lastSeparatorIndex = filePath.lastIndexOf(PATH_CONSTANTS.SEPARATOR);
    if (lastSeparatorIndex === -1 || lastSeparatorIndex === filePath.length - 1) {
      throw new InvalidPathError(filePath, "Invalid file path");
    }

    const fileName = filePath.substring(lastSeparatorIndex + 1);
    return this.sanitizeFileName(fileName);
  }

  /**
   * Check if path is absolute
   */
  static isAbsolutePath(path: string): boolean {
    return path.startsWith(PATH_CONSTANTS.SEPARATOR);
  }

  /**
   * Make path absolute relative to base path
   */
  static resolvePath(basePath: string, relativePath: string): string {
    this.validatePath(basePath);
    this.validatePath(relativePath);

    if (this.isAbsolutePath(relativePath)) {
      return this.normalizePath(relativePath);
    }

    return this.joinPath(basePath, relativePath);
  }
}

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
