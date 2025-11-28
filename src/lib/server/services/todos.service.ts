import z, { ZodError } from 'zod';

import { type Store, store } from '@/lib/server/db/store.service';
import { DatabaseError } from '@/lib/server/db/store-errors';
import { isServiceError, ServiceError, ValidationError } from '@/lib/server/services/service-errors';
import { type Todo } from '@/lib/server/services/todo.types';

let addTodoInputSchema = z.object({
  title: z.string().trim().min(1).max(30),
  completed: z.boolean(),
});

export async function getTodos() {
  return performStoreAction(async () => {
    try {
      return await store.getTodos();
    } catch (err) {
      if (isServiceError(err)) throw err;
      throw new ServiceError('Failed to retrieve todos from database', { cause: err as Error });
    }
  });
}

export async function addTodo(title: string, completed: boolean): Promise<Todo> {
  try {
    return await performStoreAction(async (store) => {
      let input = addTodoInputSchema.parse({ title, completed });
      return store.addTodo(input);
    });
  } catch (err) {
    if (isServiceError(err)) throw err;
    throw new ServiceError('Failed to add todo', { cause: err as Error });
  }
}

// Encapsulate store interaction and error handling
async function performStoreAction<T = unknown>(action: (store: Store) => Promise<T>) {
  try {
    return await action(store);
  } catch (err) {
    if (err instanceof ZodError) {
      throw ValidationError.fromZodError(err);
    }
    if (err instanceof DatabaseError) {
      console.error('Database error:', err.message, 'Cause:', (err.cause as Error | undefined)?.message ?? 'Unknown');
    }

    // Throw the original error to give service methods a chance to handle to return a custom error message
    throw err;
  }
}
