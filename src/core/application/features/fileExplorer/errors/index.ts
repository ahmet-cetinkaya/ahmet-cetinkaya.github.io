import { TranslationKeys } from "@domain/data/Translations";

export abstract class FileExplorerError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly path?: string;
  public readonly translationKey?: keyof typeof TranslationKeys;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    path?: string,
    translationKey?: keyof typeof TranslationKeys,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.path = path;
    this.translationKey = translationKey;

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
    super(
      `File not found: ${path}`,
      "FILE_NOT_FOUND",
      404,
      path,
      TranslationKeys.apps_file_explorer_error_file_not_found,
    );
  }

  isRecoverable(): boolean {
    return false;
  }
}

export class PermissionError extends FileExplorerError {
  constructor(path: string, operation: string) {
    super(
      `Permission denied for ${operation} on: ${path}`,
      "PERMISSION_DENIED",
      403,
      path,
      TranslationKeys.apps_file_explorer_error_permission_denied,
    );
  }

  isRecoverable(): boolean {
    return false;
  }
}

export class InvalidFilenameError extends FileExplorerError {
  constructor(filename: string, reason: string) {
    super(
      `Invalid filename: ${filename}. Reason: ${reason}`,
      "INVALID_FILENAME",
      400,
      undefined,
      TranslationKeys.apps_file_explorer_error_invalid_filename,
    );
  }

  isRecoverable(): boolean {
    return true;
  }
}

export class PathTooLongError extends FileExplorerError {
  constructor(path: string, maxLength: number) {
    super(
      `Path too long: ${path.length} > ${maxLength} characters`,
      "PATH_TOO_LONG",
      414,
      path,
      TranslationKeys.apps_file_explorer_error_path_too_long,
    );
  }

  isRecoverable(): boolean {
    return true;
  }
}

export class FileExistsError extends FileExplorerError {
  constructor(path: string) {
    super(
      `File already exists: ${path}`,
      "ALREADY_EXISTS",
      409,
      path,
      TranslationKeys.apps_file_explorer_error_already_exists,
    );
  }

  isRecoverable(): boolean {
    return true;
  }
}

export class DirectoryNotEmptyError extends FileExplorerError {
  constructor(path: string) {
    super(
      `Directory not empty: ${path}`,
      "DIRECTORY_NOT_EMPTY",
      409,
      path,
      TranslationKeys.apps_file_explorer_error_directory_not_empty,
    );
  }

  isRecoverable(): boolean {
    return true;
  }
}

export class OperationTimeoutError extends FileExplorerError {
  constructor(operation: string, timeoutMs: number) {
    super(
      `Operation "${operation}" timed out after ${timeoutMs}ms`,
      "OPERATION_TIMEOUT",
      408,
      undefined,
      TranslationKeys.apps_file_explorer_error_operation_timeout,
    );
  }

  isRecoverable(): boolean {
    return true;
  }
}

export class QuotaExceededError extends FileExplorerError {
  constructor(limit: number) {
    super(
      `Storage quota exceeded: ${limit}`,
      "QUOTA_EXCEEDED",
      507,
      undefined,
      TranslationKeys.apps_file_explorer_error_quota_exceeded,
    );
  }

  isRecoverable(): boolean {
    return true;
  }
}

export class NetworkError extends FileExplorerError {
  constructor(originalError: Error) {
    super(
      `Network error: ${originalError.message}`,
      "NETWORK_ERROR",
      503,
      undefined,
      TranslationKeys.apps_file_explorer_error_network_error,
    );
  }

  isRecoverable(): boolean {
    return true;
  }
}

export class InvalidPathError extends FileExplorerError {
  constructor(path: string, reason: string) {
    super(
      `Invalid path: ${path}. Reason: ${reason}`,
      "INVALID_PATH",
      400,
      path,
      TranslationKeys.apps_file_explorer_error_invalid_path,
    );
  }

  isRecoverable(): boolean {
    return false;
  }
}

export class DirectoryTooDeepError extends FileExplorerError {
  constructor(path: string, depth: number, maxDepth: number) {
    super(
      `Directory structure too deep: ${depth} > ${maxDepth} at path: ${path}`,
      "DIRECTORY_TOO_DEEP",
      409,
      path,
      TranslationKeys.apps_file_explorer_error_directory_too_deep,
    );
  }

  isRecoverable(): boolean {
    return false;
  }
}

export class OperationFailedError extends FileExplorerError {
  constructor(operation: string, path: string, originalError?: Error) {
    super(
      `Operation "${operation}" failed for path: ${path}${originalError ? `. Original error: ${originalError.message}` : ""}`,
      "OPERATION_FAILED",
      500,
      path,
      TranslationKeys.apps_file_explorer_error_operation_failed,
    );
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
      return new PermissionError(path || "unknown", operation || "unknown");
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
    if (error instanceof PermissionError) return ErrorSeverity.MEDIUM;
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
