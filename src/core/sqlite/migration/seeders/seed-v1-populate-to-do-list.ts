import { type SQLiteDatabase } from 'expo-sqlite';

import { DbTableName } from '@/api/local/db-table-name';
import { seeder } from '@/core/sqlite/migration/seeders/seed-v1-seeder';
import { nullableToNull } from '@/core/type-utils';

export async function seed(db: SQLiteDatabase) {
  for (const item of seeder) {
    await db.runAsync(
      `INSERT INTO ${DbTableName.TodoItem} (id, title, description, completed, createdAt, updatedAt, dueDate, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      item.id,
      item.title,
      nullableToNull(item.description),
      item.completed,
      item.createdAt,
      item.updatedAt,
      nullableToNull(item.dueDate),
      nullableToNull(item.priority),
    );
  }
}
