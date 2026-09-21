export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

export class Logger {
  private static format(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
  ): string {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context && Object.keys(context).length > 0 ? { context } : {}),
    };
    return JSON.stringify(entry);
  }

  public static debug(message: string, context?: Record<string, unknown>): void {
    if (process.env['NODE_ENV'] !== 'production') {
      console.debug(this.format('debug', message, context));
    }
  }

  public static info(message: string, context?: Record<string, unknown>): void {
    console.info(this.format('info', message, context));
  }

  public static warn(message: string, context?: Record<string, unknown>): void {
    console.warn(this.format('warn', message, context));
  }

  public static error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    const errorDetails =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : { rawError: String(error) };

    console.error(this.format('error', message, { ...errorDetails, ...context }));
  }
}
