import { type SQLiteDatabase } from 'expo-sqlite';

import { DbTableName } from '@/api/local/db-table-name';
import { type TodoEntity } from '@/core/entity/todo-entity.types';
import { dataNotFoundError } from '@/core/error-utils';
import { nullableToNull } from '@/core/type-utils';

import { type ToDoLocalDataSource } from './todo-local-datasource.types';

export class TodoLocalDatasourceImpl implements ToDoLocalDataSource {
  private readonly db: SQLiteDatabase;

  constructor(db: SQLiteDatabase) {
    this.db = db;
  }

  private convertToDate(item: TodoEntity): TodoEntity {
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      dueDate: item.dueDate ? new Date(item.dueDate) : null,
    };
  }

  async getAll(): Promise<TodoEntity[]> {
    const results = await this.db.getAllAsync<TodoEntity>(
      `SELECT * FROM ${DbTableName.TodoItem}`,
    );
    return results.map(this.convertToDate);
  }

  async add(item: TodoEntity): Promise<TodoEntity> {
    await this.db.runAsync(
      `INSERT INTO ${DbTableName.TodoItem} (id, title, description, completed, createdAt, updatedAt, dueDate, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      item.id,
      item.title,
      nullableToNull(item.description),
      item.completed,
      item.createdAt.toISOString(),
      item.updatedAt.toISOString(),
      nullableToNull(item.dueDate?.toISOString()),
      nullableToNull(item.priority),
    );
    return item;
  }

  async fetchById(id: string): Promise<TodoEntity> {
    let result = await this.db.getFirstAsync<TodoEntity>(
      `SELECT * FROM ${DbTableName.TodoItem} WHERE id = ?`,
      id,
    );
    if (!result) {
      throw dataNotFoundError;
    }
    return this.convertToDate(result);
  }

  async edit(item: TodoEntity): Promise<TodoEntity> {
    await this.db.runAsync(
      `UPDATE ${DbTableName.TodoItem} SET title = ?, description = ?, completed = ?, updatedAt = ?, dueDate = ?, priority = ? WHERE id = ?`,
      item.title,
      nullableToNull(item.description),
      item.completed,
      item.updatedAt.toISOString(),
      nullableToNull(item.dueDate?.toISOString()),
      nullableToNull(item.priority),
      item.id,
    );
    return item;
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync(
      `DELETE FROM ${DbTableName.TodoItem} WHERE id = ?`,
      id,
    );
  }
}
