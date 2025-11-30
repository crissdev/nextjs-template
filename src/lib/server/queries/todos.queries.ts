import { cacheLife, cacheTag } from 'next/cache';

import { getTodos } from '@/lib/server/services/todos.service';

export const GET_TODOS_TAG = 'getTodos';

export async function queryTodos() {
  'use cache';
  cacheTag(GET_TODOS_TAG);
  cacheLife('minutes');

  return getTodos();
}
