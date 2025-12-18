import z, { ZodError } from 'zod';

import { loggerService } from '@/lib/server';
import { DatabaseError } from '@/lib/server/db/database-error';
import { type Store } from '@/lib/server/db/store';
import { isServiceError, ServiceError } from '@/lib/server/service-error';
import { type TodosService } from '@/lib/server/todos/todos.interfaces';
import { type Todo } from '@/lib/server/todos/todos.types';
import { ValidationError } from '@/lib/server/validation-error';

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

// Encapsulate store interaction and error handling
async function performStoreAction<T = unknown>(action: () => Promise<T>) {
  try {
    return await action();
  } catch (err) {
    if (err instanceof ZodError) {
      throw ValidationError.fromZodError(err);
    }
    if (err instanceof DatabaseError) {
      loggerService.error(
        err,
        'Database error: %s Cause: %s',
        err.message,
        (err.cause as Error | undefined)?.message ?? 'Unknown',
      );
    }

    // Throw the original error to give service methods a chance to handle to return a custom error message
    throw err;
  }
}

export function createTodosService(store: Store): TodosService {
  async function getTodos() {
    try {
      return await performStoreAction(() => store.getTodos());
    } catch (err) {
      if (isServiceError(err)) throw err;
      throw new ServiceError('Failed to retrieve todos from database', { cause: err as Error });
    }
  }

  async function addTodo(title: string, completed: boolean): Promise<Todo> {
    try {
      return await performStoreAction(() => {
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

  async function deleteTodo(id: number) {
    try {
      return await performStoreAction(() => {
        deleteTodoInputSchema.parse({ id });
        return store.deleteTodo(id);
      });
    } catch (err) {
      if (isServiceError(err)) throw err;
      throw new ServiceError('Failed to delete todo', { cause: err as Error });
    }
  }

  async function markTodoAsCompleted(id: number) {
    return toggleCompleted(id, true);
  }

  async function markTodoAsIncomplete(id: number) {
    return toggleCompleted(id, false);
  }

  async function toggleCompleted(id: number, completed: boolean) {
    try {
      return await performStoreAction(() => {
        toggleCompletedInputSchema.parse({ id, completed });
        return store.updateTodo(id, { completed });
      });
    } catch (err) {
      if (isServiceError(err)) throw err;
      throw new ServiceError('Failed to delete todo', { cause: err as Error });
    }
  }

  return {
    getTodos,
    addTodo,
    deleteTodo,
    markTodoAsCompleted,
    markTodoAsIncomplete,
  };
}
