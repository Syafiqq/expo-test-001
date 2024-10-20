import { type TodoEntity } from '@/core/entity/todo-entity.types';

export interface ToDoRepository {
  getAllFromLocal(): Promise<TodoEntity[]>;

  addToLocal(item: TodoEntity): Promise<TodoEntity>;

  fetchByIdFromLocal(id: string): Promise<TodoEntity>;

  editToLocal(item: TodoEntity): Promise<TodoEntity>;

  deleteFromLocal(id: string): Promise<void>;
}
