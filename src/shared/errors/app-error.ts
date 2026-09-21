export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public readonly isOperational = true;

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly statusCode = 400;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  public readonly statusCode = 404;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
    this.name = 'NotFoundError';
  }
}

export class ScrapingError extends AppError {
  public readonly statusCode = 502;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
    this.name = 'ScrapingError';
  }
}

export class ConcurrencyQueueError extends AppError {
  public readonly statusCode = 503;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
    this.name = 'ConcurrencyQueueError';
  }
}
