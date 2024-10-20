import { useMemo } from 'react';

import { useTodoLocalDatasource } from '@/api/local/todo';

import { type ToDoRepository } from './todo-repository.types';
import { TodoRepositoryImpl } from './todo-repository-impl';

export function useTodoRepository(): ToDoRepository {
  const local = useTodoLocalDatasource();
  return useMemo(() => new TodoRepositoryImpl(local), [local]);
}
