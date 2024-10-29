import { type SQLiteDatabase } from 'expo-sqlite';

import { DbTableName } from '@/api/local/db-table-name';
import { seeder } from '@/core/sqlite/migration/seeders/seed-v1-seeder';

export async function seed(db: SQLiteDatabase) {
  // loop seeder with index
  for (const item of seeder) {
    await db.runAsync(
      `UPDATE ${DbTableName.TodoItem} SET picture = ? WHERE id = ?`,
      item.picture,
      item.id,
    );
  }
}
