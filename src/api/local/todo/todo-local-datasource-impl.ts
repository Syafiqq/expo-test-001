import { type SQLiteDatabase } from 'expo-sqlite';

import { DbTableName } from '@/api/local/db-table-name';
import { type TodoEntity } from '@/core/entity/todo-entity.types';
import { type TodoSearchEntity } from '@/core/entity/todo-search-entity';
import { dataNotFoundError } from '@/core/error-utils';
import { compactMap, nullableToNull } from '@/core/type-utils';

import { type ToDoLocalDataSource } from './todo-local-datasource.types';

export class TodoLocalDatasourceImpl implements ToDoLocalDataSource {
  private readonly db: SQLiteDatabase;

  constructor(db: SQLiteDatabase) {
    this.db = db;
  }

  private sanitiseDataType(item: TodoEntity): TodoEntity {
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      dueDate: item.dueDate ? new Date(item.dueDate) : null,
      completed: !!item.completed,
    };
  }

  async getAll(): Promise<TodoEntity[]> {
    const results = await this.db.getAllAsync<TodoEntity>(
      `SELECT * FROM ${DbTableName.TodoItem}`,
    );
    return results.map(this.sanitiseDataType);
  }

  async getAllWithQuery(
    query: TodoSearchEntity | undefined,
    search: string | undefined,
  ): Promise<TodoEntity[]> {
    const filter = mergeFilter(
      search ? getSearch(search) : undefined,
      query ? getFilter(query) : undefined,
    );
    const order = mergeOrder(query ? getOrderBy(query) : undefined);
    const results = await this.db.getAllAsync<TodoEntity>(
      `SELECT * FROM ${DbTableName.TodoItem} ${filter} ${order}`,
    );
    return results.map(this.sanitiseDataType);
  }

  async add(item: TodoEntity): Promise<TodoEntity> {
    await this.db.runAsync(
      `INSERT INTO ${DbTableName.TodoItem} (id, title, description, completed, createdAt, updatedAt, dueDate, priority, picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      item.id,
      item.title,
      nullableToNull(item.description),
      item.completed,
      item.createdAt.getTime(),
      item.updatedAt.getTime(),
      nullableToNull(item.dueDate?.getTime()),
      nullableToNull(item.priority),
      item.picture,
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
    return this.sanitiseDataType(result);
  }

  async edit(item: TodoEntity): Promise<TodoEntity> {
    await this.db.runAsync(
      `UPDATE ${DbTableName.TodoItem} SET title = ?, description = ?, completed = ?, updatedAt = ?, dueDate = ?, priority = ?, picture = ? WHERE id = ?`,
      item.title,
      nullableToNull(item.description),
      item.completed,
      item.updatedAt.getTime(),
      nullableToNull(item.dueDate?.getTime()),
      nullableToNull(item.priority),
      item.picture,
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

const getSearch = function (query: string): string | undefined {
  if (query.length <= 0) {
    return undefined;
  }

  let queryStrings: string[] = [];

  queryStrings.push(`title LIKE '%${query}%'`);
  queryStrings.push(`description LIKE '%${query}%'`);

  return queryStrings.join(' OR ');
};

const getFilter = function (query: TodoSearchEntity): string | undefined {
  let queryStrings: string[] = [];

  const after = query.after;
  if (after) {
    queryStrings.push(`dueDate >= ${after}`);
  }

  const before = query.before;
  if (before) {
    queryStrings.push(`dueDate <= ${before}`);
  }

  if (query.priorities.length > 0) {
    queryStrings.push(
      `priority IN (${query.priorities.map((priority) => `'${priority}'`).join(', ')})`,
    );
  }

  if (query.completeness.length > 0) {
    let queryCompletenesses: string[] = [];
    for (const completeness of query.completeness) {
      switch (completeness) {
        case 'incomplete':
          queryCompletenesses.push('completed = 0');
          break;
        case 'complete':
          queryCompletenesses.push('completed = 1');
          break;
      }
    }
    const final = queryCompletenesses.join(' OR ');
    queryStrings.push(`(${final})`);
  }
  return queryStrings.join(' AND ');
};

const mergeFilter = (...filters: (string | undefined)[]): string => {
  let result = compactMap(filters, (filter) => filter)
    .map((filter) => `(${filter})`)
    .join(' AND ');
  if (result.length <= 0) {
    return '';
  }
  return `WHERE ${result}`;
};

const getOrderBy = function (query: TodoSearchEntity): string | undefined {
  const toOrder = function (orderType: string): string {
    return orderType === 'ascending' ? 'ASC' : 'DESC';
  };

  let orderStrings: string[] = [];

  if (query.ordering.length <= 0) {
    return undefined;
  }
  for (const order of query.ordering) {
    switch (order.name) {
      case 'name':
        orderStrings.push(`title ${toOrder(order.status)}`);
        break;
      case 'description':
        orderStrings.push(`description ${toOrder(order.status)}`);
        break;
      case 'completed':
        orderStrings.push(`completed ${toOrder(order.status)}`);
        break;
      case 'dueDate':
        orderStrings.push(`dueDate ${toOrder(order.status)}`);
        break;
      case 'priority':
        orderStrings.push(`priority ${toOrder(order.status)}`);
        break;
    }
  }
  return orderStrings.join(', ');
};

const mergeOrder = (...orders: (string | undefined)[]): string => {
  let result = compactMap(orders, (order) => order).join(', ');
  if (result.length <= 0) {
    return '';
  }
  return `ORDER BY ${result}`;
};
