import { faker } from '@faker-js/faker';
import { expect, test, vi } from 'vitest';

import { ValidationError } from '@/lib/server/services/service-errors';
import { store } from '@/lib/server/services/store.service';
import { addTodo } from '@/lib/server/services/todos.service';

// We don't need the real thing in unit tests
vi.mock('@/lib/server/services/store.service.ts');
vi.mocked(store.runInTransaction).mockImplementation(async (fn) => fn());

test('Add new todo', async () => {
  let title = faker.lorem.words(2);
  let completed = faker.datatype.boolean();
  let newId = faker.number.int();

  vi.mocked(store.addTodo).mockResolvedValueOnce({ id: newId, title, completed });

  expect(await addTodo(title, completed)).toEqual({ id: newId, title, completed });
});

test.each(['', '  '])('Cannot add a todo without a title "%s"', async (title) => {
  await expect(() => addTodo(title, true)).rejects.toThrow(
    new ValidationError(
      expect.arrayContaining([expect.objectContaining({ code: 'too_small', path: ['title'] })]),
      'Validation failed',
    ),
  );
});

test('Cannot add a todo with a title length grater than 30 characters', async () => {
  await expect(() => addTodo(faker.lorem.words(30), true)).rejects.toThrow(
    new ValidationError(
      expect.arrayContaining([expect.objectContaining({ code: 'too_big', path: ['title'] })]),
      'Validation failed',
    ),
  );
});
