import type { SQLiteDatabase } from 'expo-sqlite';

import { DbTableName } from '@/api/local/db-table-name';
import { seed } from '@/core/sqlite/migration/seeders/seed-v2-populate-to-do-list';

async function ddlToDoItem(db: SQLiteDatabase) {
  await db.execAsync(`
PRAGMA journal_mode = 'wal';
ALTER TABLE ${DbTableName.TodoItem} ADD COLUMN picture TEXT;
  `);
}

export async function run(db: SQLiteDatabase) {
  await db.execAsync(`PRAGMA journal_mode = 'wal';`);
  await ddlToDoItem(db);
  await seed(db);
}
