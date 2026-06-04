/**
 * Logger utility for consistent application logging
 * In development: logs to console with formatting
 * In production: Can be extended to use external logging services
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
}

interface LogDetails {
  [key: string]: unknown;
}

interface UIInteractionDetails {
  visible?: boolean;
  position?: { x: number; y: number };
  entryName?: string;
  selectedFilesCount?: number;
  [key: string]: unknown;
}

class Logger {
  private config: LoggerConfig;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== "production";
    this.config = {
      level: this.isDevelopment ? "debug" : "warn",
      enableConsole: this.isDevelopment,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enableConsole) return false;

    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    return levels[level] >= levels[this.config.level];
  }

  private formatMessage(level: LogLevel, message: string, ...args: unknown[]): [string, ...unknown[]] {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (args.length > 0) {
      return [`${prefix} ${message}`, ...args];
    }

    return [`${prefix} ${message}`];
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog("debug")) {
      const [formattedMessage, ...formattedArgs] = this.formatMessage("debug", message, ...args);
      // eslint-disable-next-line no-console
      console.debug(formattedMessage, ...formattedArgs);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog("info")) {
      const [formattedMessage, ...formattedArgs] = this.formatMessage("info", message, ...args);
      // eslint-disable-next-line no-console
      console.info(formattedMessage, ...formattedArgs);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog("warn")) {
      const [formattedMessage, ...formattedArgs] = this.formatMessage("warn", message, ...args);
      // eslint-disable-next-line no-console
      console.warn(formattedMessage, ...formattedArgs);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog("error")) {
      const [formattedMessage, ...formattedArgs] = this.formatMessage("error", message, ...args);
      // eslint-disable-next-line no-console
      console.error(formattedMessage, ...formattedArgs);
    }
  }

  // Specialized logging methods for different contexts
  fileOperation(operation: string, details: LogDetails): void {
    this.debug(`File operation: ${operation}`, details);
  }

  uiInteraction(component: string, action: string, details?: UIInteractionDetails): void {
    this.debug(`UI interaction: ${component} - ${action}`, details);
  }

  clipboard(operation: string, itemCount?: number): void {
    this.debug(`Clipboard ${operation}`, itemCount ? `${itemCount} items` : "");
  }

  performance(operation: string, duration?: number): void {
    if (duration !== undefined) {
      this.info(`Performance: ${operation} completed in ${duration}ms`);
    } else {
      this.debug(`Performance: ${operation} started`);
    }
  }

  errorBoundary(error: Error, component: string): void {
    this.error(`Error in ${component}: ${error.message}`, {
      stack: error.stack,
      component,
    });
  }
}

// Export singleton instance
export const logger = new Logger();
export default logger;
