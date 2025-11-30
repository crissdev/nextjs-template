import z, { ZodError } from 'zod';

import { isServiceError, ServiceError, ValidationError } from '@/lib/server/services/service-errors';
import { store } from '@/lib/server/services/store.service';
import { DatabaseError } from '@/lib/server/services/store-errors';
import { type Todo } from '@/lib/server/services/todo.types';

let idSchema = z.number().int().positive();
let titleSchema = z.string().trim().min(1).max(30);
let completedSchema = z.boolean();

let addTodoInputSchema = z.object({
  title: titleSchema,
  completed: completedSchema,
});

let deleteTodoInputSchema = z.object({
  id: idSchema,
});

let toggleCompletedInputSchema = z.object({
  id: idSchema,
  completed: completedSchema,
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
    return await performStoreAction(async () => {
      // Using a transaction just as an example
      return store.runInTransaction(async () => {
        let input = addTodoInputSchema.parse({ title, completed });
        return store.addTodo(input);
      });
    });
  } catch (err) {
    if (isServiceError(err)) throw err;
    throw new ServiceError('Failed to add todo', { cause: err as Error });
  }
}

export async function deleteTodo(id: number) {
  try {
    return await performStoreAction(async () => {
      deleteTodoInputSchema.parse({ id });
      return await store.deleteTodo(id);
    });
  } catch (err) {
    if (isServiceError(err)) throw err;
    throw new ServiceError('Failed to delete todo', { cause: err as Error });
  }
}

export async function markTodoAsCompleted(id: number) {
  return toggleCompleted(id, true);
}

export async function markTodoAsIncomplete(id: number) {
  return toggleCompleted(id, false);
}

async function toggleCompleted(id: number, completed: boolean) {
  try {
    return await performStoreAction(async () => {
      toggleCompletedInputSchema.parse({ id, completed });
      return await store.updateTodo(id, { completed });
    });
  } catch (err) {
    if (isServiceError(err)) throw err;
    throw new ServiceError('Failed to delete todo', { cause: err as Error });
  }
}

// Encapsulate store interaction and error handling
async function performStoreAction<T = unknown>(action: () => Promise<T>) {
  try {
    return await action();
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
