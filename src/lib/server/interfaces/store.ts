import { type UnitOfWork } from '@/lib/server/interfaces/unit-of-work';
import type { Todo } from '@/lib/server/todos/todos.types';

export type AddTodoInput = {
  title: string;
  completed: boolean;
};

export type UpdateTodoInput = {
  title?: string;
  completed?: boolean;
};

export interface Store extends UnitOfWork {
  addTodo(input: AddTodoInput): Promise<Todo>;
  getTodos(): Promise<Todo[]>;
  deleteTodo(id: number): Promise<void>;
  updateTodo(id: number, input: UpdateTodoInput): Promise<Todo>;
}
