import { connection } from 'next/server';
import { Suspense } from 'react';

import AddTodoForm from '@/app/(todos)/add-todo-form';
import { TodoList } from '@/app/(todos)/todo-list';
import WelcomeMessage from '@/lib/ui/components/shared/welcome-message';

export default async function Home() {
  await connection();

  return (
    <div className="p-5">
      <div className={'mb-5'}>
        <WelcomeMessage />
      </div>
      <h2 className={'mb-2.5 text-lg font-bold'}>Todos</h2>
      <Suspense>
        <AddTodoForm />
        <hr className={'my-5'} />
        <TodoList />
      </Suspense>
    </div>
  );
}
