'use server';

import { updateTag } from 'next/cache';

import { type ActionResult, toActionErrorResult, toActionSuccessResult } from '@/lib/server/actions/types';
import { GET_TODOS_TAG } from '@/lib/server/queries/todos.queries';
import { type Todo } from '@/lib/server/services/todo.types';
import { addTodo, deleteTodo, markTodoAsCompleted, markTodoAsIncomplete } from '@/lib/server/services/todos.service';

export async function addTodoAction(title: string): Promise<ActionResult<Todo>> {
  try {
    let todo = toActionSuccessResult(await addTodo(title, false));
    updateTag(GET_TODOS_TAG);
    return todo;
  } catch (err) {
    return toActionErrorResult(err as Error);
  }
}

export async function deleteTodoAction(id: number): Promise<ActionResult<void>> {
  try {
    await deleteTodo(id);
    updateTag(GET_TODOS_TAG);

    return toActionSuccessResult();
  } catch (err) {
    return toActionErrorResult(err as Error);
  }
}

export async function toggleTodoAction(id: number, completed: boolean) {
  try {
    let todo = completed ? await markTodoAsCompleted(id) : await markTodoAsIncomplete(id);
    updateTag(GET_TODOS_TAG);
    return toActionSuccessResult(todo);
  } catch (err) {
    return toActionErrorResult(err as Error);
  }
}
