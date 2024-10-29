import { type TodoEntity } from '@/core/entity/todo-entity.types';
import type { TodoSearchEntity } from '@/core/entity/todo-search-entity';

export interface ToDoLocalDataSource {
  getAll(): Promise<TodoEntity[]>;

  getAllWithQuery(query: TodoSearchEntity): Promise<TodoEntity[]>;

  add(item: TodoEntity): Promise<TodoEntity>;

  fetchById(id: string): Promise<TodoEntity>;

  edit(item: TodoEntity): Promise<TodoEntity>;

  delete(id: string): Promise<void>;
}
