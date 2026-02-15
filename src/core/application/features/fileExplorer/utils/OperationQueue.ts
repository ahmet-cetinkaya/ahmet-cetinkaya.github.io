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

export interface QueuedOperation {
  id: string;
  type: OperationType;
  priority: number; // Lower number = higher priority
  status: OperationStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  execute: () => Promise<void>;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  retryCount?: number;
  maxRetries?: number;
  paths?: string[]; // Paths involved in the operation for conflict detection
}

export interface OperationResult {
  id: string;
  status: OperationStatus;
  success: boolean;
  error?: Error;
  duration?: number;
}

/**
 * Manages a queue of file operations with conflict detection and retry logic
 */
export class OperationQueue {
  private queue: QueuedOperation[] = [];
  private runningOperations = new Map<string, QueuedOperation>();
  private isProcessing = false;
  private maxConcurrentOperations = 3;

  constructor(maxConcurrent: number = 3) {
    this.maxConcurrentOperations = maxConcurrent;
  }

  /**
   * Add an operation to the queue
   */
  add(operation: Omit<QueuedOperation, "id" | "createdAt" | "status">): string {
    const id = this.generateOperationId();

    const queuedOp: QueuedOperation = {
      ...operation,
      id,
      status: OperationStatus.PENDING,
      createdAt: new Date(),
      maxRetries: operation.maxRetries || PERFORMANCE_LIMITS.MAX_OPERATION_RETRIES,
      retryCount: 0,
      timeout: operation.timeout || PERFORMANCE_LIMITS.OPERATION_TIMEOUT_MS,
    };

    // Insert operation in priority order
    this.insertByPriority(queuedOp);

    logger.debug(`Added operation ${id} of type ${operation.type} to queue`);

    // Start processing if not already running
    this.processQueue();

    return id;
  }

  /**
   * Cancel an operation
   */
  cancel(operationId: string): boolean {
    // Check if it's running
    const runningOp = this.runningOperations.get(operationId);
    if (runningOp) {
      runningOp.status = OperationStatus.CANCELLED;
      this.runningOperations.delete(operationId);
      logger.debug(`Cancelled running operation ${operationId}`);
      return true;
    }

    // Check if it's in the queue
    const queueIndex = this.queue.findIndex((op) => op.id === operationId);
    if (queueIndex !== -1) {
      const [cancelledOp] = this.queue.splice(queueIndex, 1);
      cancelledOp.status = OperationStatus.CANCELLED;
      logger.debug(`Cancelled queued operation ${operationId}`);
      return true;
    }

    return false;
  }

  /**
   * Get operation status
   */
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

  /**
   * Get queue information
   */
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

  /**
   * Clear all operations (emergency use only)
   */
  clear(): void {
    // Cancel all running operations
    for (const [, operation] of this.runningOperations) {
      operation.status = OperationStatus.CANCELLED;
    }
    this.runningOperations.clear();

    // Cancel all queued operations
    this.queue.forEach((op) => {
      op.status = OperationStatus.CANCELLED;
    });
    this.queue = [];

    logger.info("Cleared all operations in queue");
  }

  /**
   * Process the queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.queue.length > 0 && this.runningOperations.size < this.maxConcurrentOperations) {
        const operation = this.queue.shift()!;
        await this.executeOperation(operation);
      }
    } catch (error) {
      logger.error("Error processing operation queue:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Execute a single operation
   */
  private async executeOperation(operation: QueuedOperation): Promise<void> {
    // Check for conflicts with running operations
    if (this.hasConflicts(operation)) {
      // Re-queue the operation with higher priority
      operation.priority -= 1;
      this.insertByPriority(operation);
      logger.debug(`Re-queued operation ${operation.id} due to conflicts`);
      return;
    }

    operation.status = OperationStatus.RUNNING;
    operation.startedAt = new Date();
    this.runningOperations.set(operation.id, operation);

    logger.debug(`Executing operation ${operation.id} of type ${operation.type}`);

    try {
      // Execute with timeout
      await this.executeWithTimeout(operation);

      operation.status = OperationStatus.COMPLETED;
      operation.completedAt = new Date();

      operation.onComplete?.();
      logger.debug(`Completed operation ${operation.id}`);
    } catch (error) {
      const operationError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      if (this.shouldRetry(operation, operationError)) {
        operation.retryCount!++;
        operation.status = OperationStatus.PENDING;

        // Re-queue with exponential backoff priority penalty
        const backoffPenalty = Math.pow(2, operation.retryCount!) - 1;
        operation.priority += backoffPenalty;

        this.insertByPriority(operation);
        logger.debug(`Retrying operation ${operation.id} (attempt ${operation.retryCount})`);
      } else {
        operation.status = OperationStatus.FAILED;
        operation.completedAt = new Date();

        operation.onError?.(operationError);
        logger.error(`Failed operation ${operation.id}:`, operationError);
      }
    } finally {
      this.runningOperations.delete(operation.id);

      // Continue processing queue
      this.processQueue();
    }
  }

  /**
   * Execute operation with timeout
   */
  private async executeWithTimeout(operation: QueuedOperation): Promise<void> {
    const timeout = operation.timeout || PERFORMANCE_LIMITS.OPERATION_TIMEOUT_MS;

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new OperationTimeoutError(operation.type, timeout));
      }, timeout);
    });

    const executionPromise = operation.execute();

    await Promise.race([executionPromise, timeoutPromise]);
  }

  /**
   * Check if operation has conflicts with running operations
   */
  private hasConflicts(operation: QueuedOperation): boolean {
    if (!operation.paths || operation.paths.length === 0) {
      return false;
    }

    // Check each running operation for path conflicts
    for (const runningOp of this.runningOperations.values()) {
      if (!runningOp.paths || runningOp.paths.length === 0) {
        continue;
      }

      // Check for any overlapping paths
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

  /**
   * Check if two paths conflict based on operation types
   */
  private pathsConflict(path1: string, path2: string, type1: OperationType, type2: OperationType): boolean {
    // Exact match
    if (path1 === path2) {
      return true;
    }

    // Parent-child relationships
    const path1IsParent = path2.startsWith(`${path1}/`);
    const path2IsParent = path1.startsWith(`${path2}/`);

    // Conflicting operations
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

  /**
   * Determine if operation should be retried
   */
  private shouldRetry(operation: QueuedOperation, error: Error): boolean {
    // Don't retry if cancelled
    if (operation.status === OperationStatus.CANCELLED) {
      return false;
    }

    // Check retry count
    if (operation.retryCount! >= operation.maxRetries!) {
      return false;
    }

    // Retry on timeout and certain network errors
    return (
      error instanceof OperationTimeoutError ||
      error.message.toLowerCase().includes("network") ||
      error.message.toLowerCase().includes("timeout") ||
      error.message.toLowerCase().includes("connection")
    );
  }

  /**
   * Insert operation in priority order
   */
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

  /**
   * Generate unique operation ID
   */
  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Global operation queue instance
export const globalOperationQueue = new OperationQueue();
