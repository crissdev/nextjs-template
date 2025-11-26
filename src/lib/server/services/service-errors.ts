import { type ZodError } from 'zod';

export class ServiceError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, options);
    this.name = 'ServiceError';
  }

  toJSON() {
    return {
      message: this.message,
    };
  }
}

export class ValidationError extends ServiceError {
  constructor(
    public readonly issues: { path: PropertyKey[]; message: string }[],
    message = 'Validation failed',
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  static fromZodError(err: ZodError) {
    return new ValidationError(
      err.issues.map((issue) => ({ path: issue.path, message: issue.message, code: issue.code })),
      'Validation failed',
    );
  }

  toJSON() {
    return {
      ...super.toJSON(),
      issues: this.issues,
    };
  }
}

export function isServiceError(err: unknown): err is ServiceError {
  return err instanceof ServiceError;
}
