export class DatabaseError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, options);
    this.name = 'DatabaseError';
  }
}
