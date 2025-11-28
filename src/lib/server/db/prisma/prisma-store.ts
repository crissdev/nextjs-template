import { type PrismaClient, type Todo as PrismaTodo } from '@/lib/server/db/prisma/.generated/client';
import { prisma } from '@/lib/server/db/prisma/prisma-client';
import { type AddTodoInput } from '@/lib/server/db/store.service';
import { DatabaseError } from '@/lib/server/db/store-errors';
import { type Todo } from '@/lib/server/services/todo.types';

export async function addTodo(input: AddTodoInput): Promise<Todo> {
  let result = await performDatabaseAction(() => {
    let currentDate = new Date();
    return prisma.todo.create({
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
    if (err instanceof Error) {
      if (err.name.startsWith('PrismaClient')) throw new DatabaseError('A database error occurred', { cause: err });
      throw err;
    }
    throw new DatabaseError('A database error occurred', { cause: new Error(String(err)) });
  }
}
