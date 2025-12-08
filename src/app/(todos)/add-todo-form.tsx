import { faker } from '@faker-js/faker';

import { addTodoAction } from '@/lib/server/todos/todos.actions';
import { Button } from '@/lib/ui/components/cn/button';

export default function AddTodoForm() {
  let onAddTodo = async () => {
    'use server';
    await addTodoAction(faker.lorem.words(2));
  };

  return <Button onClick={onAddTodo}>Add Todo</Button>;
}
