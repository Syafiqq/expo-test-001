import { uuid } from 'expo-modules-core';
import { type SQLiteDatabase } from 'expo-sqlite';

import { DbTableName } from '@/api/local/db-table-name';
import { type TodoEntity } from '@/core/entity/todo-entity.types';
import { nullableToNull } from '@/core/type-utils';

function getRandomPriority(): 'low' | 'medium' | 'high' {
  const priorities = ['low', 'medium', 'high'];
  return priorities[Math.floor(Math.random() * priorities.length)] as
    | 'low'
    | 'medium'
    | 'high';
}

function generateRandomTodoItem(): TodoEntity {
  const now = new Date();
  return {
    id: uuid.v4(),
    title: `Todo ${Math.floor(Math.random() * 1000)}`,
    description: `Description ${Math.floor(Math.random() * 1000)}`,
    completed: Math.random() < 0.5,
    createdAt: now,
    updatedAt: now,
    dueDate:
      Math.random() < 0.5
        ? new Date(now.getTime() + Math.floor(Math.random() * 1000000000))
        : null,
    priority: getRandomPriority(),
    picture: null,
  };
}

export async function seed(db: SQLiteDatabase) {
  const todoItems = Array.from({ length: 10 }, generateRandomTodoItem);

  for (const item of todoItems) {
    await db.runAsync(
      `INSERT INTO ${DbTableName.TodoItem} (id, title, description, completed, createdAt, updatedAt, dueDate, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      item.id,
      item.title,
      nullableToNull(item.description),
      item.completed,
      item.createdAt.getTime(),
      item.updatedAt.getTime(),
      nullableToNull(item.dueDate?.getTime()),
      nullableToNull(item.priority),
    );
  }
}
