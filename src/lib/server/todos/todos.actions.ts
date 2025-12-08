'use server';

import { updateTag } from 'next/cache';

import { todosService } from '@/lib/server';
import { type ActionResult, toActionErrorResult, toActionSuccessResult } from '@/lib/server/action-result';
import { GET_TODOS_TAG } from '@/lib/server/todos/todos.queries';
import { type Todo } from '@/lib/server/todos/todos.types';

export async function addTodoAction(title: string): Promise<ActionResult<Todo>> {
  try {
    let todo = toActionSuccessResult(await todosService.addTodo(title, false));
    updateTag(GET_TODOS_TAG);
    return todo;
  } catch (err) {
    return toActionErrorResult(err as Error);
  }
}

export async function deleteTodoAction(id: number): Promise<ActionResult<void>> {
  try {
    await todosService.deleteTodo(id);
    updateTag(GET_TODOS_TAG);

    return toActionSuccessResult();
  } catch (err) {
    return toActionErrorResult(err as Error);
  }
}

export async function toggleTodoAction(id: number, completed: boolean) {
  try {
    let todo = completed ? await todosService.markTodoAsCompleted(id) : await todosService.markTodoAsIncomplete(id);
    updateTag(GET_TODOS_TAG);
    return toActionSuccessResult(todo);
  } catch (err) {
    return toActionErrorResult(err as Error);
  }
}
