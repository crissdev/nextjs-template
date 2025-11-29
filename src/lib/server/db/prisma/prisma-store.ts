import { type PrismaClient, type Todo as PrismaTodo } from '@/lib/server/db/prisma/.generated/client';
import { prisma as prismaClient } from '@/lib/server/db/prisma/prisma-client';
import { type AddTodoInput } from '@/lib/server/services/store.service';
import { DatabaseError } from '@/lib/server/services/store-errors';
import { type Todo } from '@/lib/server/services/todo.types';

let currentTx: null | Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'> = null;

export async function addTodo(input: AddTodoInput): Promise<Todo> {
  let result = await performDatabaseAction((client) => {
    let currentDate = new Date();
    return client.todo.create({
      data: {
        ...input,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });
  });
  return mapTodo(result);
}

export async function getTodos(): Promise<Todo[]> {
  return await performDatabaseAction(async (client) => {
    let results = await client.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return results.map(mapTodo);
  });
}

export async function runInTransaction<T = unknown>(callback: () => Promise<T>): Promise<T> {
  if (currentTx) throw new DatabaseError('Nested transactions are not supported');

  try {
    return await prismaClient.$transaction(async (tx) => {
      currentTx = tx;
      try {
        return await callback();
      } finally {
        currentTx = null;
      }
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.name.startsWith('PrismaClient')) throw new DatabaseError('A database error occurred', { cause: err });
      throw err;
    }
    throw new DatabaseError('A database error occurred', { cause: new Error(String(err)) });
  }
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
async function performDatabaseAction<T = unknown>(action: (client: NonNullable<typeof currentTx>) => Promise<T>) {
  try {
    return await action(currentTx ?? prismaClient);
  } catch (err) {
    if (err instanceof Error) {
      if (err.name.startsWith('PrismaClient')) throw new DatabaseError('A database error occurred', { cause: err });
      throw err;
    }
    throw new DatabaseError('A database error occurred', { cause: new Error(String(err)) });
  }
}
