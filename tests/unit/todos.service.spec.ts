import { faker } from '@faker-js/faker';
import { beforeEach, expect, test, vi } from 'vitest';

import { type Store } from '@/lib/server/db/store';
import { type TodosService } from '@/lib/server/todos/todos.interfaces';
import { createTodosService } from '@/lib/server/todos/todos.service';

class FakeStore implements Store {
  addTodo = vi.fn<Store['addTodo']>();

  getTodos = vi.fn<Store['getTodos']>();

  deleteTodo = vi.fn<Store['deleteTodo']>();

  updateTodo = vi.fn<Store['updateTodo']>();

  runInTransaction = async <T = unknown>(callback: () => Promise<T>): Promise<T> => callback();
}

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

  await expect(todosService.addTodo(title, completed)).resolves.toEqual({ id: newId, title, completed });
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
