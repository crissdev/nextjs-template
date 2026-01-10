import { vi } from 'vitest';

import { type Store } from '@/lib/server/db/store';

export class FakeStore implements Store {
  addTodo = vi.fn<Store['addTodo']>();

  getTodos = vi.fn<Store['getTodos']>();

  deleteTodo = vi.fn<Store['deleteTodo']>();

  updateTodo = vi.fn<Store['updateTodo']>();

  runInTransaction = async <T = unknown>(callback: () => Promise<T>): Promise<T> => callback();
}
