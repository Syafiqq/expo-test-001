import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';

import { type ToDoLocalDataSource } from './todo-local-datasource.types';
import { TodoLocalDatasourceImpl } from './todo-local-datasource-impl';

export function useTodoLocalDatasource(): ToDoLocalDataSource {
  const db = useSQLiteContext();
  return useMemo(() => new TodoLocalDatasourceImpl(db), [db]);
}
