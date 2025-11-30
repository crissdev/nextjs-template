import TodoActions from '@/app/(todos)/todo-actions';
import ToggleTodo from '@/app/(todos)/toggle-todo';
import { queryTodos } from '@/lib/server/queries/todos.queries';

export async function TodoList() {
  let todos = await queryTodos();

  if (todos.length === 0) {
    return <p>No todos yet.</p>;
  }

  return (
    <ul className={'grid grid-cols-[auto_50px_auto] gap-4 max-w-max'}>
      <div className={'grid grid-cols-subgrid col-span-full'}>
        <span className={'font-bold text-center'}>Title</span>
        <span className={'font-bold text-center'}>Completed</span>
      </div>
      {todos.map((todo) => (
        <div key={todo.id} className={'grid grid-cols-subgrid items-center align-center col-span-full'}>
          <span className={'col-start-1'}>{todo.title}</span>
          <span className={'col-start-2 justify-self-center'}>
            <ToggleTodo id={todo.id} completed={todo.completed} />
          </span>
          <div className={'col-start-3'}>
            <TodoActions id={todo.id} />
          </div>
        </div>
      ))}
    </ul>
  );
}
