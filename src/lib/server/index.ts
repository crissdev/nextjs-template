// Composition Root
// - import services from here

import prismaStore from '@/lib/server/db/prisma-store';
import { type Store } from '@/lib/server/db/store';
import { createLogger } from '@/lib/server/logger.service';
import { type TodosService } from '@/lib/server/todos/todos.interfaces';
import { createTodosService } from '@/lib/server/todos/todos.service';

export let storeService: Store = prismaStore;
export let todosService: TodosService = createTodosService(storeService);
export let loggerService = createLogger();
