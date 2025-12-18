import { faker } from '@faker-js/faker';
import { expect, test } from 'vitest';

import { storeService } from '@/lib/server';

function newTodo() {
  return {
    title: faker.lorem.words(2),
    completed: false,
  };
}

// Run the tests in sequence to avoid nested transaction error (as they are not supported)

test('add two todos in a transaction and return them', async () => {
  let firstTodo = newTodo();
  let secondTodo = newTodo();

  let addedTodos = await storeService.runInTransaction(async () =>
    Promise.all([await storeService.addTodo(firstTodo), await storeService.addTodo(secondTodo)]),
  );

  expect(addedTodos).toEqual([
    { id: expect.any(Number), ...firstTodo },
    { id: expect.any(Number), ...secondTodo },
  ]);

  expect(await storeService.getTodos()).toEqual(
    expect.arrayContaining([
      { id: expect.any(Number), ...firstTodo },
      { id: expect.any(Number), ...secondTodo },
    ]),
  );
});

test('no todos are added when the transaction is rolled back', async () => {
  await expect(
    async () =>
      await storeService.runInTransaction(async () => {
        await storeService.addTodo(newTodo());
        await storeService.addTodo(newTodo());
        throw new Error('Transaction was rolled back');
      }),
  ).rejects.toThrow('Transaction was rolled back');

  // Ensure no todos were added
  await expect(storeService.getTodos()).resolves.toEqual([]);
});

test('nested transactions are not supported', async () => {
  await expect(() => {
    return storeService.runInTransaction(async () => {
      return storeService.runInTransaction(async () => {});
    });
  }).rejects.toThrow('Nested transactions are not supported');
});
