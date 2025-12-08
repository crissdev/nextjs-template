// Composition Root
// - import services from here

import * as prismaStoreImpl from '@/lib/server/db/prisma-store';
import { type Store } from '@/lib/server/interfaces/store';
import { type TodosService } from '@/lib/server/todos/todos.interfaces';
import { createTodosService } from '@/lib/server/todos/todos.service';

export let storeService: Store = prismaStoreImpl;
export let todosService: TodosService = createTodosService(storeService);
