import { TranslationKeys } from "@domain/data/Translations";

export interface FileExplorerErrorOptions {
  message: string;
  code: string;
  errorId: string;
  statusCode?: number;
  path?: string;
  translationKey?: keyof typeof TranslationKeys;
  contextPath?: string;
}

export abstract class FileExplorerError extends Error {
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

  public getUserMessage(): string {
    return this.message;
  }

  public getTranslationKey(): keyof typeof TranslationKeys | undefined {
    return this.translationKey;
  }

  public isRecoverable(): boolean {
    return false;
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

  isRecoverable(): boolean {
    return false;
  }
}

export class FileExplorerPermissionError extends FileExplorerError {
  constructor(path: string, operation: string) {
    super({
      message: `Permission denied for ${operation} on: ${path}`,
      code: "PERMISSION_DENIED",
      errorId: "PERMISSION_DENIED",
      statusCode: 403,
      path,
      translationKey: TranslationKeys.apps_file_explorer_error_permission_denied,
    });
  }

  isRecoverable(): boolean {
    return false;
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

  isRecoverable(): boolean {
    return true;
  }
}

export class PathTooLongError extends FileExplorerError {
  constructor(path: string, maxLength: number) {
    super({
      message: `Path too long: ${path.length} > ${maxLength} characters`,
      code: "PATH_TOO_LONG",
      errorId: "PATH_TOO_LONG",
      statusCode: 414,
      path,
      translationKey: TranslationKeys.apps_file_explorer_error_path_too_long,
    });
  }

  isRecoverable(): boolean {
    return true;
  }
}

export class FileExistsError extends FileExplorerError {
  constructor(path: string) {
    super({
      message: `File already exists: ${path}`,
      code: "ALREADY_EXISTS",
      errorId: "ALREADY_EXISTS",
      statusCode: 409,
      path,
      translationKey: TranslationKeys.apps_file_explorer_error_already_exists,
    });
  }

  isRecoverable(): boolean {
    return true;
  }
}

export class DirectoryNotEmptyError extends FileExplorerError {
  constructor(path: string) {
    super({
      message: `Directory not empty: ${path}`,
      code: "DIRECTORY_NOT_EMPTY",
      errorId: "DIRECTORY_NOT_EMPTY",
      statusCode: 409,
      path,
      translationKey: TranslationKeys.apps_file_explorer_error_directory_not_empty,
    });
  }

  isRecoverable(): boolean {
    return true;
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

  isRecoverable(): boolean {
    return true;
  }
}

export class QuotaExceededError extends FileExplorerError {
  constructor(limit: number) {
    super({
      message: `Storage quota exceeded: ${limit}`,
      code: "QUOTA_EXCEEDED",
      errorId: "QUOTA_EXCEEDED",
      statusCode: 507,
      path: undefined,
      translationKey: TranslationKeys.apps_file_explorer_error_quota_exceeded,
    });
  }

  isRecoverable(): boolean {
    return true;
  }
}

export class NetworkError extends FileExplorerError {
  constructor(originalError: Error) {
    super({
      message: `Network error: ${originalError.message}`,
      code: "NETWORK_ERROR",
      errorId: "NETWORK_ERROR",
      statusCode: 503,
      path: undefined,
      translationKey: TranslationKeys.apps_file_explorer_error_network_error,
    });
  }

  isRecoverable(): boolean {
    return true;
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

  isRecoverable(): boolean {
    return false;
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

  isRecoverable(): boolean {
    return false;
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

  isRecoverable(): boolean {
    return true;
  }
}
export class FileExplorerErrorFactory {
  static fromError(error: Error, path?: string, operation?: string): FileExplorerError {
    if (error instanceof FileExplorerError) {
      return error;
    }

    const message = error.message.toLowerCase();

    if (message.includes("not found") || message.includes("does not exist")) {
      return new FileNotFoundError(path || "unknown");
    }

    if (message.includes("permission") || message.includes("denied") || message.includes("forbidden")) {
      return new FileExplorerPermissionError(path || "unknown", operation || "unknown");
    }

    if (message.includes("timeout") || message.includes("timed out")) {
      return new OperationTimeoutError(operation || "unknown", 30000);
    }

    if (message.includes("network") || message.includes("connection")) {
      return new NetworkError(error);
    }

    if (message.includes("quota") || message.includes("space")) {
      return new QuotaExceededError(0);
    }

    return new OperationFailedError(operation || "unknown", path || "unknown", error);
  }
}

export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface ErrorInfo {
  error: FileExplorerError;
  severity: ErrorSeverity;
  context?: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export class ErrorClassifier {
  static getSeverity(error: FileExplorerError): ErrorSeverity {
    if (error instanceof FileNotFoundError) return ErrorSeverity.LOW;
    if (error instanceof InvalidFilenameError) return ErrorSeverity.LOW;
    if (error instanceof FileExistsError) return ErrorSeverity.MEDIUM;
    if (error instanceof FileExplorerPermissionError) return ErrorSeverity.MEDIUM;
    if (error instanceof OperationTimeoutError) return ErrorSeverity.HIGH;
    if (error instanceof NetworkError) return ErrorSeverity.HIGH;
    if (error instanceof QuotaExceededError) return ErrorSeverity.HIGH;
    if (error instanceof DirectoryTooDeepError) return ErrorSeverity.CRITICAL;
    if (error instanceof PathTooLongError) return ErrorSeverity.CRITICAL;

    return ErrorSeverity.MEDIUM;
  }

  static shouldRetry(error: FileExplorerError): boolean {
    return (
      error instanceof NetworkError || error instanceof OperationTimeoutError || error instanceof QuotaExceededError
    );
  }

  static shouldAlert(error: FileExplorerError): boolean {
    return this.getSeverity(error) === ErrorSeverity.HIGH || this.getSeverity(error) === ErrorSeverity.CRITICAL;
  }
}
