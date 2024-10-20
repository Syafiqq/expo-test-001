import { type TodoEntity } from '@/core/entity/todo-entity.types';

export interface ToDoLocalDataSource {
  getAll(): Promise<TodoEntity[]>;

  add(item: TodoEntity): Promise<TodoEntity>;

  fetchById(id: string): Promise<TodoEntity>;

  edit(item: TodoEntity): Promise<TodoEntity>;

  delete(id: string): Promise<void>;
}
