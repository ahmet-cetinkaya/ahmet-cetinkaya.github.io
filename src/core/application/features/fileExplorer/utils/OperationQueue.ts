import { logger } from "@shared/utils/logger";
import { PERFORMANCE_LIMITS } from "../constants";
import { OperationTimeoutError } from "../errors";

/**
 * Operation queue to prevent race conditions and manage concurrent file operations
 */
export enum OperationType {
  COPY = "copy",
  MOVE = "move",
  DELETE = "delete",
  CREATE = "create",
  RENAME = "rename",
}

export enum OperationStatus {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

/**
 * Discriminated union for operation states with enforced invariants
 */
export type QueuedOperation =
  | PendingOperation
  | RunningOperation
  | CompletedOperation
  | FailedOperation
  | CancelledOperation;

interface BaseOperation {
  readonly id: string;
  readonly type: OperationType;
  priority: number; // Lower number = higher priority
  readonly createdAt: Date;
  readonly execute: () => Promise<void>;
  readonly onProgress?: (progress: number) => void;
  readonly onComplete?: () => void;
  readonly onError?: (error: Error) => void;
  readonly timeout: number;
  readonly retryCount: number;
  readonly maxRetries: number;
  conflictRetryCount: number;
  readonly maxConflictRetries: number;
  readonly paths?: string[]; // Paths involved in the operation for conflict detection
}

/**
 * Pending operation - not yet started
 */
export interface PendingOperation extends BaseOperation {
  readonly status: OperationStatus.PENDING;
  startedAt?: never;
  completedAt?: never;
}

/**
 * Running operation - currently being executed
 */
export interface RunningOperation extends BaseOperation {
  readonly status: OperationStatus.RUNNING;
  readonly startedAt: Date;
  completedAt?: never;
}

/**
 * Completed operation - finished successfully
 */
export interface CompletedOperation extends BaseOperation {
  readonly status: OperationStatus.COMPLETED;
  readonly startedAt: Date;
  readonly completedAt: Date;
}

/**
 * Failed operation - terminated with error
 */
export interface FailedOperation extends BaseOperation {
  readonly status: OperationStatus.FAILED;
  readonly startedAt: Date;
  readonly completedAt: Date;
}

/**
 * Cancelled operation - terminated before completion
 */
export interface CancelledOperation extends BaseOperation {
  readonly status: OperationStatus.CANCELLED;
  startedAt?: Date;
  completedAt?: Date;
}

/**
 * Type guard to check operation status
 */
export function isPendingOperation(op: QueuedOperation): op is PendingOperation {
  return op.status === OperationStatus.PENDING;
}

export function isRunningOperation(op: QueuedOperation): op is RunningOperation {
  return op.status === OperationStatus.RUNNING;
}

export function isCompletedOperation(op: QueuedOperation): op is CompletedOperation {
  return op.status === OperationStatus.COMPLETED;
}

export function isFailedOperation(op: QueuedOperation): op is FailedOperation {
  return op.status === OperationStatus.FAILED;
}

export function isCancelledOperation(op: QueuedOperation): op is CancelledOperation {
  return op.status === OperationStatus.CANCELLED;
}

/**
 * State transition helpers that enforce valid transitions at compile time
 */
export function startOperation(op: PendingOperation): RunningOperation {
  return {
    ...op,
    status: OperationStatus.RUNNING,
    startedAt: new Date(),
  };
}

export function completeOperation(op: RunningOperation): CompletedOperation {
  return {
    ...op,
    status: OperationStatus.COMPLETED,
    completedAt: new Date(),
  };
}

export function failOperation(op: RunningOperation | PendingOperation): FailedOperation {
  const startedAt = isRunningOperation(op) ? op.startedAt : new Date();
  return {
    ...op,
    status: OperationStatus.FAILED,
    startedAt,
    completedAt: new Date(),
  };
}

export function cancelOperation(op: QueuedOperation): CancelledOperation {
  if (isRunningOperation(op) || isCompletedOperation(op) || isFailedOperation(op)) {
    return {
      ...op,
      status: OperationStatus.CANCELLED as const,
      startedAt: op.startedAt,
      completedAt: new Date(),
    };
  }

  return {
    ...op,
    status: OperationStatus.CANCELLED as const,
  };
}

export interface OperationResult {
  id: string;
  status: OperationStatus;
  success: boolean;
  error?: Error;
  duration?: number;
}

export class OperationQueue {
  private queue: QueuedOperation[] = [];
  private runningOperations = new Map<string, QueuedOperation>();
  private maxConcurrentOperations = 3;

  constructor(maxConcurrent: number = 3) {
    this.maxConcurrentOperations = maxConcurrent;
  }

  add(operation: Omit<QueuedOperation, "id" | "createdAt" | "status" | "startedAt" | "completedAt">): string {
    const id = this.generateOperationId();

    const pendingOp: PendingOperation = {
      ...operation,
      id,
      status: OperationStatus.PENDING,
      createdAt: new Date(),
      maxRetries: operation.maxRetries || PERFORMANCE_LIMITS.MAX_OPERATION_RETRIES,
      maxConflictRetries: operation.maxConflictRetries ?? 5,
      conflictRetryCount: 0,
      retryCount: 0,
      timeout: operation.timeout || PERFORMANCE_LIMITS.OPERATION_TIMEOUT_MS,
    };

    this.insertByPriority(pendingOp);

    logger.debug(`Added operation ${id} of type ${operation.type} to queue`);

    this.processQueue();

    return id;
  }

  cancel(operationId: string): boolean {
    const runningOp = this.runningOperations.get(operationId);
    if (runningOp) {
      // Persist cancelled state before deletion
      const cancelled = cancelOperation(runningOp);
      this.runningOperations.set(operationId, cancelled);
      this.runningOperations.delete(operationId);
      logger.debug(`Cancelled running operation ${operationId}`);
      return true;
    }

    const queueIndex = this.queue.findIndex((op) => op.id === operationId);
    if (queueIndex !== -1) {
      const [opToCancel] = this.queue.splice(queueIndex, 1);
      cancelOperation(opToCancel);
      logger.debug(`Cancelled queued operation ${operationId}`);
      return true;
    }

    return false;
  }

  getStatus(operationId: string): OperationStatus | null {
    const runningOp = this.runningOperations.get(operationId);
    if (runningOp) {
      return runningOp.status;
    }

    const queuedOp = this.queue.find((op) => op.id === operationId);
    if (queuedOp) {
      return queuedOp.status;
    }

    return null;
  }

  getQueueInfo(): {
    pending: number;
    running: number;
    total: number;
    operations: Array<{ id: string; type: OperationType; status: OperationStatus; priority: number }>;
  } {
    return {
      pending: this.queue.length,
      running: this.runningOperations.size,
      total: this.queue.length + this.runningOperations.size,
      operations: [
        ...this.queue.map((op) => ({
          id: op.id,
          type: op.type,
          status: op.status,
          priority: op.priority,
        })),
        ...Array.from(this.runningOperations.values()).map((op) => ({
          id: op.id,
          type: op.type,
          status: op.status,
          priority: op.priority,
        })),
      ],
    };
  }

  clear(): void {
    const runningOps = Array.from(this.runningOperations.values());
    for (const op of runningOps) {
      const cancelled = cancelOperation(op);
      this.runningOperations.set(op.id, cancelled);
    }
    this.runningOperations.clear();

    this.queue = [];

    logger.info("Cleared all operations in queue");
  }

  private processQueue(): void {
    while (this.queue.length > 0 && this.runningOperations.size < this.maxConcurrentOperations) {
      const operation = this.queue.shift()!;
      this.executeOperation(operation);
    }
  }

  private async executeOperation(operation: QueuedOperation): Promise<void> {
    if (!isPendingOperation(operation)) {
      logger.warn(`Operation ${operation.id} is not pending, skipping execution`);
      return;
    }

    if (this.hasConflicts(operation)) {
      const maxRetries = operation.maxConflictRetries ?? 5;
      if (operation.conflictRetryCount >= maxRetries) {
        logger.error(`Operation ${operation.id} exceeded max conflict retries (${maxRetries}), failing permanently`);
        const failedOp = failOperation(operation);
        failedOp.onError?.(new Error(`Operation failed: too many conflicts (max ${maxRetries})`));
        return;
      }

      operation.conflictRetryCount += 1;
      operation.priority -= 1;
      this.insertByPriority(operation);
      logger.debug(
        `Re-queued operation ${operation.id} due to conflicts (attempt ${operation.conflictRetryCount}/${maxRetries})`,
      );
      return;
    }

    const runningOp = startOperation(operation);
    this.runningOperations.set(operation.id, runningOp);

    logger.debug(`Executing operation ${operation.id} of type ${operation.type}`);

    try {
      await this.executeWithTimeout(runningOp);

      const completedOp = completeOperation(runningOp);
      completedOp.onComplete?.();
      logger.debug(`Completed operation ${operation.id}`);
    } catch (error) {
      const operationError = error instanceof Error ? error : new Error(String(error));

      if (this.shouldRetry(operation, operationError)) {
        const retryOp: PendingOperation = {
          ...operation,
          retryCount: operation.retryCount + 1,
          status: OperationStatus.PENDING,
        };

        const backoffPenalty = Math.pow(2, retryOp.retryCount) - 1;
        retryOp.priority += backoffPenalty;

        this.insertByPriority(retryOp);
        logger.debug(`Retrying operation ${operation.id} (attempt ${retryOp.retryCount})`);
      } else {
        const failedOp = failOperation(runningOp);
        failedOp.onError?.(operationError);
        logger.error(`Failed operation ${operation.id}:`, operationError);
      }
    } finally {
      this.runningOperations.delete(operation.id);

      this.processQueue();
    }
  }

  private async executeWithTimeout(operation: RunningOperation): Promise<void> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new OperationTimeoutError(operation.type, operation.timeout));
      }, operation.timeout);
    });

    const executionPromise = operation.execute();

    await Promise.race([executionPromise, timeoutPromise]);
  }

  private hasConflicts(operation: QueuedOperation): boolean {
    if (!operation.paths || operation.paths.length === 0) {
      return false;
    }

    for (const runningOp of this.runningOperations.values()) {
      if (!runningOp.paths || runningOp.paths.length === 0) {
        continue;
      }

      for (const opPath of operation.paths) {
        for (const runningPath of runningOp.paths) {
          if (this.pathsConflict(opPath, runningPath, operation.type, runningOp.type)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  private pathsConflict(path1: string, path2: string, type1: OperationType, type2: OperationType): boolean {
    if (path1 === path2) {
      return true;
    }

    const path1IsParent = path2.startsWith(`${path1}/`);
    const path2IsParent = path1.startsWith(`${path2}/`);

    const conflictingOps = new Set([
      `${OperationType.DELETE}-${OperationType.COPY}`,
      `${OperationType.DELETE}-${OperationType.MOVE}`,
      `${OperationType.DELETE}-${OperationType.RENAME}`,
      `${OperationType.MOVE}-${OperationType.DELETE}`,
      `${OperationType.MOVE}-${OperationType.MOVE}`,
      `${OperationType.MOVE}-${OperationType.RENAME}`,
      `${OperationType.RENAME}-${OperationType.DELETE}`,
      `${OperationType.RENAME}-${OperationType.MOVE}`,
      `${OperationType.RENAME}-${OperationType.RENAME}`,
    ]);

    const opKey = `${type1}-${type2}`;
    const reverseOpKey = `${type2}-${type1}`;

    return (path1IsParent || path2IsParent) && (conflictingOps.has(opKey) || conflictingOps.has(reverseOpKey));
  }

  private shouldRetry(operation: PendingOperation | RunningOperation, error: Error): boolean {
    if (operation.retryCount >= operation.maxRetries) {
      return false;
    }

    if (error instanceof OperationTimeoutError) {
      return true;
    }

    const fileExplorerError = error as { isRecoverable?: () => boolean };
    if (typeof fileExplorerError.isRecoverable === "function" && fileExplorerError.isRecoverable()) {
      return true;
    }

    const messageLower = error.message.toLowerCase();
    return messageLower.includes("network") || messageLower.includes("timeout") || messageLower.includes("connection");
  }

  private insertByPriority(operation: QueuedOperation): void {
    let insertIndex = this.queue.length;

    for (let i = 0; i < this.queue.length; i++) {
      if (this.queue[i].priority > operation.priority) {
        insertIndex = i;
        break;
      }
    }

    this.queue.splice(insertIndex, 0, operation);
  }

  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}

export const globalOperationQueue = new OperationQueue();
