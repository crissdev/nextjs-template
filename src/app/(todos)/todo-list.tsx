import TodoActions from '@/app/(todos)/todo-actions';
import ToggleTodo from '@/app/(todos)/toggle-todo';
import { queryTodos } from '@/lib/server/todos/todos.queries';

export async function TodoList() {
  let todos = await queryTodos();

  if (todos.length === 0) {
    return <p>No todos yet.</p>;
  }

  return (
    <ul className={'grid max-w-max grid-cols-[auto_90px_auto] gap-4'}>
      <div className={'col-span-full grid grid-cols-subgrid'}>
        <span className={'text-center font-bold'}>Title</span>
        <span className={'text-center font-bold'}>Completed</span>
      </div>
      {todos.map((todo) => (
        <div key={todo.id} className={'align-center col-span-full grid grid-cols-subgrid items-center'}>
          <span className={'col-start-1'}>{todo.title}</span>
          <div className={'col-start-2 justify-self-center'}>
            <ToggleTodo id={todo.id} completed={todo.completed} />
          </div>
          <div className={'col-start-3'}>
            <TodoActions id={todo.id} />
          </div>
        </div>
      ))}
    </ul>
  );
}
