export interface UnitOfWork {
  runInTransaction<T = unknown>(callback: () => Promise<T>): Promise<T>;
}
