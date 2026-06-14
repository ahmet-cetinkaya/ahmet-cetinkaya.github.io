import { TranslationKeys } from "@domain/data/Translations";

interface FileExplorerErrorOptions {
  message: string;
  code: string;
  errorId: string;
  statusCode?: number;
  path?: string;
  translationKey?: keyof typeof TranslationKeys;
  contextPath?: string;
}

abstract class FileExplorerError extends Error {
  public readonly code: string;
  public readonly errorId: string;
  public readonly statusCode?: number;
  public readonly path?: string;
  public readonly translationKey?: keyof typeof TranslationKeys;
  public readonly contextPath?: string;

  constructor(options: FileExplorerErrorOptions) {
    super(options.message);
    this.name = this.constructor.name;
    this.code = options.code;
    this.errorId = options.errorId;
    this.statusCode = options.statusCode;
    this.path = options.path;
    this.translationKey = options.translationKey;
    this.contextPath = options.contextPath;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class FileNotFoundError extends FileExplorerError {
  constructor(path: string) {
    super({
      message: `File not found: ${path}`,
      code: "FILE_NOT_FOUND",
      errorId: "FILE_NOT_FOUND",
      statusCode: 404,
      path,
      translationKey: TranslationKeys.apps_file_explorer_error_file_not_found,
    });
  }
}

export class InvalidFilenameError extends FileExplorerError {
  constructor(filename: string, reason: string) {
    super({
      message: `Invalid filename: ${filename}. Reason: ${reason}`,
      code: "INVALID_FILENAME",
      errorId: "INVALID_FILENAME",
      statusCode: 400,
      path: undefined,
      translationKey: TranslationKeys.apps_file_explorer_error_invalid_filename,
    });
  }
}

export class OperationFailedError extends FileExplorerError {
  constructor(operation: string, path: string, originalError?: Error) {
    super({
      message: `Operation "${operation}" failed for path: ${path}${originalError ? `. Original error: ${originalError.message}` : ""}`,
      code: "OPERATION_FAILED",
      errorId: "OPERATION_FAILED",
      statusCode: 500,
      path,
      translationKey: TranslationKeys.apps_file_explorer_error_operation_failed,
    });
  }
}

export class InvalidPathError extends FileExplorerError {
  constructor(path: string, reason: string, contextPath?: string) {
    let translationKey = TranslationKeys.apps_file_explorer_error_invalid_path;
    let message = reason;

    if (reason === "SYSTEM_DIRECTORY_ACCESS" && contextPath) {
      translationKey = TranslationKeys.apps_file_explorer_error_system_directory_access;
      message = `Access to system directory "${contextPath}" is not allowed`;
    } else if (reason.startsWith("SYSTEM_DIRECTORY_ACCESS")) {
      translationKey = TranslationKeys.apps_file_explorer_error_system_directory_access;
    }

    super({
      message: `Invalid path: ${path}. Reason: ${message}`,
      code: "INVALID_PATH",
      errorId: "INVALID_PATH",
      statusCode: 400,
      path,
      translationKey,
      contextPath,
    });
  }
}

export class OperationTimeoutError extends FileExplorerError {
  constructor(operation: string, timeoutMs: number) {
    super({
      message: `Operation "${operation}" timed out after ${timeoutMs}ms`,
      code: "OPERATION_TIMEOUT",
      errorId: "OPERATION_TIMEOUT",
      statusCode: 408,
      path: undefined,
      translationKey: TranslationKeys.apps_file_explorer_error_operation_timeout,
    });
  }
}

export class DirectoryTooDeepError extends FileExplorerError {
  constructor(path: string, depth: number, maxDepth: number) {
    super({
      message: `Directory structure too deep: ${depth} > ${maxDepth} at path: ${path}`,
      code: "DIRECTORY_TOO_DEEP",
      errorId: "DIRECTORY_TOO_DEEP",
      statusCode: 409,
      path,
      translationKey: TranslationKeys.apps_file_explorer_error_directory_too_deep,
    });
  }
}
