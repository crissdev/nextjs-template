import { faker } from '@faker-js/faker';
import { expect, test } from 'vitest';

import { todosService } from '@/lib/server';

test('add todo', async () => {
  let todoTitle = faker.lorem.words(2);
  let todoCompleted = faker.datatype.boolean();

  let addTodoResult = await todosService.addTodo(todoTitle, todoCompleted);

  expect(addTodoResult).toEqual({
    id: expect.any(Number),
    title: todoTitle,
    completed: todoCompleted,
  });

  let allTodos = await todosService.getTodos();
  expect(allTodos).toEqual([
    {
      id: expect.any(Number),
      title: todoTitle,
      completed: todoCompleted,
    },
  ]);
});

test('delete todo', async () => {
  let { id } = await todosService.addTodo(faker.lorem.words(2), faker.datatype.boolean());

  await todosService.deleteTodo(id);

  let allTodos = await todosService.getTodos();
  expect(allTodos).toHaveLength(0);
});

test('toggle todo completed status', async () => {
  let title = faker.lorem.words(2);
  let completed = faker.datatype.boolean();
  let todo = await todosService.addTodo(title, completed);

  let updatedTodo = completed
    ? await todosService.markTodoAsIncomplete(todo.id)
    : await todosService.markTodoAsCompleted(todo.id);

  let todos = await todosService.getTodos();
  expect(todos).toEqual([{ id: updatedTodo.id, title, completed: !completed }]);
});
