import { expect, test } from 'vitest';

import { addTodo, getTodos } from '@/lib/server/services/todos.service';

test('create todo', async () => {
  let addTodoResult = await addTodo('Learn Next.js', false);
  expect(addTodoResult).toEqual({
    id: expect.any(Number),
    title: 'Learn Next.js',
    completed: false,
  });

  let allTodos = await getTodos();
  expect(allTodos).toEqual([
    {
      id: expect.any(Number),
      title: 'Learn Next.js',
      completed: false,
    },
  ]);
});
