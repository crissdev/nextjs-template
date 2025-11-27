import { type PrismaClient, type Todo as PrismaTodo } from '@/lib/server/db/prisma/.generated/client';
import { prisma } from '@/lib/server/db/prisma/prisma-client';
import { type AddTodoInput } from '@/lib/server/db/store.service';
import { DatabaseConnectionError, DatabaseError, UniqueConstraintError } from '@/lib/server/db/store-errors';
import { type Todo } from '@/lib/server/services/todo.types';

export async function addTodo(input: AddTodoInput): Promise<Todo> {
  let result = await performDatabaseAction(() =>
    prisma.todo.create({
      data: {
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  );
  return mapTodo(result);
}

export async function getTodos(): Promise<Todo[]> {
  return await performDatabaseAction(async () => {
    let results = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return results.map(mapTodo);
  });
}

//-----------------------------------------------------------------------------
// @private
//

function mapTodo(input: PrismaTodo): Todo {
  return {
    id: input.id,
    title: input.title,
    completed: input.completed,
  };
}

// Encapsulate database interaction and error handling
async function performDatabaseAction<T = unknown>(action: (client: PrismaClient) => Promise<T>) {
  try {
    return await action(prisma);
  } catch (err) {
    if (isPrismaClientInitializationError(err)) {
      if (err.message.includes("Can't reach database server")) {
        throw new DatabaseConnectionError(err.message, { cause: err });
      }
    }
    if (isPrismaClientKnownRequestError(err)) {
      if (err.code === 'P2002')
        throw new UniqueConstraintError(err.message, {
          cause: err,
          fields: err.meta?.target as string[] | undefined,
        });
    }

    // todo: Handle other errors

    throw new DatabaseError('A database error occurred', { cause: err as Error });
  }
}

// Type guards for error types
function isPrismaClientInitializationError(error: unknown): error is Error {
  return error instanceof Error && error.name === 'PrismaClientInitializationError';
}

function isPrismaClientKnownRequestError(
  error: unknown,
): error is Error & { code: string; meta?: { target: string[] } } {
  return error instanceof Error && error.name === 'PrismaClientKnownRequestError';
}
