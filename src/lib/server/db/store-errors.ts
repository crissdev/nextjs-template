export class DatabaseError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, options);
    this.name = 'DataAccessError';
  }
}

export class DatabaseConnectionError extends DatabaseError {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, options);
    this.name = 'DatabaseConnectionError';
  }
}

export class UniqueConstraintError extends DatabaseError {
  public readonly fields: string[];

  constructor(message: string, options?: { fields?: string[]; cause?: Error }) {
    super(message, options);
    this.name = 'UniqueConstraintError';
    this.fields = options?.fields ?? [];
  }
}
