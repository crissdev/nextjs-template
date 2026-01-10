import { faker } from '@faker-js/faker';
import { beforeEach, expect, test, vi } from 'vitest';

import { type Store } from '@/lib/server/db/store';
import { type TodosService } from '@/lib/server/todos/todos.interfaces';
import { createTodosService } from '@/lib/server/todos/todos.service';

import { FakeStore } from './fakes/fake-store';

let store: Store;
let todosService: TodosService;

beforeEach(() => {
  store = new FakeStore();
  todosService = createTodosService(store);
});

test('Add new todo', async () => {
  let title = faker.lorem.words(2);
  let completed = faker.datatype.boolean();
  let newId = faker.number.int();

  vi.mocked(store.addTodo).mockResolvedValueOnce({ id: newId, title, completed });

  expect(await todosService.addTodo(title, completed)).toEqual({ id: newId, title, completed });
  expect(store.addTodo).toHaveBeenCalledWith({ title, completed });
});

test.each(['', '  '])('Cannot add a todo without a title "%s"', async (title) => {
  await expect(todosService.addTodo(title, true)).rejects.toMatchObject({
    message: 'Validation failed',
    issues: expect.arrayContaining([expect.objectContaining({ code: 'too_small', path: ['title'] })]),
  });
});

test('Cannot add a todo with a title length greater than 30 characters', async () => {
  await expect(todosService.addTodo(faker.lorem.words(30), true)).rejects.toMatchObject({
    message: 'Validation failed',
    issues: expect.arrayContaining([expect.objectContaining({ code: 'too_big', path: ['title'] })]),
  });
});
