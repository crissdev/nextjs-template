import { connection } from 'next/server';
import { Suspense } from 'react';

import { getTodos } from '@/lib/server/services/todos.service';
import WelcomeMessage from '@/lib/ui/components/shared/welcome-message';

export default async function Home() {
  await connection();

  return (
    <div className="p-5">
      <div className={'mb-5'}>
        <WelcomeMessage />
      </div>
      <h2 className={'text-lg font-bold mb-2.5'}>Todos</h2>
      <Suspense>
        <TodoList />
      </Suspense>
    </div>
  );
}

async function TodoList() {
  let todos = await getTodos();

  if (todos.length === 0) {
    return <p>No todos yet.</p>;
  }

  return (
    <ul className={'grid grid-cols-[auto_50px] gap-4 max-w-max'}>
      {todos.map((todo) => (
        <div key={todo.id} className={'grid grid-cols-subgrid col-span-full'}>
          <span className={'col-start-1'}>{todo.title}</span>
          <span className={'col-start-2'}>{todo.completed ? '✓' : '𐄂'}</span>
        </div>
      ))}
    </ul>
  );
}
