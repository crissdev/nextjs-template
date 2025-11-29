import { faker } from '@faker-js/faker';
import { expect, test } from 'vitest';

import { getTodos, runInTransaction } from '@/lib/server/db/prisma/prisma-store';
import { store } from '@/lib/server/services/store.service';

function newTodo() {
  return {
    title: faker.lorem.words(2),
    completed: false,
  };
}

// Run the tests in sequence to avoid nested transaction error (as they are not supported)

test.sequential('add two todos in a transaction and return them', async () => {
  let firstTodo = newTodo();
  let secondTodo = newTodo();

  let addedTodos = await runInTransaction(async () =>
    Promise.all([await store.addTodo(firstTodo), await store.addTodo(secondTodo)]),
  );

  expect(addedTodos).toEqual([
    { id: expect.any(Number), ...firstTodo },
    { id: expect.any(Number), ...secondTodo },
  ]);

  expect(await getTodos()).toEqual(
    expect.arrayContaining([
      { id: expect.any(Number), ...firstTodo },
      { id: expect.any(Number), ...secondTodo },
    ]),
  );
});

test.sequential('no todos are added when the transaction is rolled back', async () => {
  await expect(
    async () =>
      await runInTransaction(async () => {
        await store.addTodo(newTodo());
        await store.addTodo(newTodo());
        throw new Error('Transaction was rolled back');
      }),
  ).rejects.toThrow('Transaction was rolled back');

  // Ensure no todos were added
  await expect(getTodos()).resolves.toEqual([]);
});
