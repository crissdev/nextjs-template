import type { Todo } from '@/lib/server/todos/todos.types';

export interface TodosService {
  getTodos(): Promise<Todo[]>;
  addTodo(title: string, completed: boolean): Promise<Todo>;
  deleteTodo(id: number): Promise<void>;
  markTodoAsCompleted(id: number): Promise<Todo>;
  markTodoAsIncomplete(id: number): Promise<Todo>;
}
