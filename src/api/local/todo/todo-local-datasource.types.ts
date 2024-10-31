import { type TodoEntity } from '@/core/entity/todo-entity.types';
import type { TodoPaginationEntity } from '@/core/entity/todo-pagination.types';
import type { TodoSearchEntity } from '@/core/entity/todo-search-entity';

export interface ToDoLocalDataSource {
  getAll(
    pagination: TodoPaginationEntity | undefined,
  ): Promise<TodoEntity[]>;

  getAllWithQuery(
    query: TodoSearchEntity | undefined,
    search: string | undefined,
    pagination: TodoPaginationEntity | undefined,
  ): Promise<TodoEntity[]>;

  add(item: TodoEntity): Promise<TodoEntity>;

  fetchById(id: string): Promise<TodoEntity>;

  edit(item: TodoEntity): Promise<TodoEntity>;

  delete(id: string): Promise<void>;
}
