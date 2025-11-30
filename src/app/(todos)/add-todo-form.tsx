import { faker } from '@faker-js/faker';

import { addTodoAction } from '@/lib/server/actions/todos.actions';

export default function AddTodoForm() {
  let onAddTodo = async () => {
    'use server';
    await addTodoAction(faker.lorem.words(2));
  };

  return (
    <button onClick={onAddTodo} className={'border rounded-md px-3 py-2 cursor-pointer hover:bg-gray-800'}>
      Add Todo
    </button>
  );
}
