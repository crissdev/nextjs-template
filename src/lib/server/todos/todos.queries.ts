import { cacheLife, cacheTag } from 'next/cache';

import { todosService } from '@/lib/server';

export const GET_TODOS_TAG = 'getTodos';

export async function queryTodos() {
  'use cache';
  cacheTag(GET_TODOS_TAG);
  cacheLife('minutes');

  return todosService.getTodos();
}
