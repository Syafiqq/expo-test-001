import { type TodoEntity } from '@/core/entity/todo-entity.types';
import { type TodoSearchEntity } from '@/core/entity/todo-search-entity';

export interface ToDoRepository {
  getAllFromLocal(
    query: TodoSearchEntity | undefined,
    search: string | undefined
  ): Promise<TodoEntity[]>;

  addToLocal(item: TodoEntity): Promise<TodoEntity>;

  fetchByIdFromLocal(id: string): Promise<TodoEntity>;

  editToLocal(item: TodoEntity): Promise<TodoEntity>;

  deleteFromLocal(id: string): Promise<void>;
}
