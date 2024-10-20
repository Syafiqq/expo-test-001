import type { SQLiteDatabase } from 'expo-sqlite';

import { DbTableName } from '@/api/local/db-table-name';

import { seed } from './seeders/seed-v1-populate-to-do-list';

async function ddlToDoItem(db: SQLiteDatabase) {
  await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE IF NOT EXISTS ${DbTableName.TodoItem} (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  dueDate DATETIME,
  priority TEXT CHECK(priority IN ('low', 'medium', 'high'))
);
  `);
}

export async function run(db: SQLiteDatabase) {
  await db.execAsync(`PRAGMA journal_mode = 'wal';`);
  await ddlToDoItem(db);
  await seed(db);
}
