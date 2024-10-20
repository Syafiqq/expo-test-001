import { type ToDoLocalDataSource } from '@/api/local/todo/todo-local-datasource.types';
import { type TodoEntity } from '@/core/entity/todo-entity.types';

import { type ToDoRepository } from './todo-repository.types';

export class TodoRepositoryImpl implements ToDoRepository {
  private readonly local: ToDoLocalDataSource;

  constructor(local: ToDoLocalDataSource) {
    this.local = local;
  }

  async getAllFromLocal(): Promise<TodoEntity[]> {
    return this.local.getAll();
  }

  async addToLocal(item: TodoEntity): Promise<TodoEntity> {
    return this.local.add(item);
  }

  async fetchByIdFromLocal(id: string): Promise<TodoEntity> {
    return this.local.fetchById(id);
  }

  async editToLocal(item: TodoEntity): Promise<TodoEntity> {
    return this.local.edit(item);
  }

  async deleteFromLocal(id: string): Promise<void> {
    return this.local.delete(id);
  }
}
