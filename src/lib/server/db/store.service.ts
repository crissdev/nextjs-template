import * as prismaStore from '@/lib/server/db/prisma/prisma-store';
import { type Todo } from '@/lib/server/services/todo.types';

export type AddTodoInput = {
  title: string;
  completed: boolean;
};

export interface Store {
  addTodo(input: AddTodoInput): Promise<Todo>;
  getTodos(): Promise<Todo[]>;
}

export function setStore(implementation: Store) {
  store = implementation;
}

export let store: Store = prismaStore;
