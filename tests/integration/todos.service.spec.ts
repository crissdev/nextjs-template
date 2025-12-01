import { faker } from '@faker-js/faker';
import { expect, test } from 'vitest';

import {
  addTodo,
  deleteTodo,
  getTodos,
  markTodoAsCompleted,
  markTodoAsIncomplete,
} from '@/lib/server/services/todos.service';

test('add todo', async () => {
  let todoTitle = faker.lorem.words(2);
  let todoCompleted = faker.datatype.boolean();

  let addTodoResult = await addTodo(todoTitle, todoCompleted);

  expect(addTodoResult).toEqual({
    id: expect.any(Number),
    title: todoTitle,
    completed: todoCompleted,
  });

  let allTodos = await getTodos();
  expect(allTodos).toEqual([
    {
      id: expect.any(Number),
      title: todoTitle,
      completed: todoCompleted,
    },
  ]);
});

test('delete todo', async () => {
  let { id } = await addTodo(faker.lorem.words(2), faker.datatype.boolean());

  await deleteTodo(id);

  let allTodos = await getTodos();
  expect(allTodos).toHaveLength(0);
});

test('toggle todo completed status', async () => {
  let title = faker.lorem.words(2);
  let completed = faker.datatype.boolean();
  let todo = await addTodo(title, completed);

  let updatedTodo = completed ? await markTodoAsIncomplete(todo.id) : await markTodoAsCompleted(todo.id);

  let todos = await getTodos();
  expect(todos).toEqual([{ id: updatedTodo.id, title, completed: !completed }]);
});
