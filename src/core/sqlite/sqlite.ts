import { Env } from '@env';
import { type SQLiteDatabase } from 'expo-sqlite';

import { run } from './migration';

interface DbVersion {
  user_version: number;
}

export async function doInit(db: SQLiteDatabase) {
  await migrateDbIfNeeded(db);
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = Env.SQLITE_VERSION;
  let result = await db.getFirstAsync<DbVersion>('PRAGMA user_version');
  let userVersion = result?.user_version ?? -1;
  if (userVersion >= DATABASE_VERSION) {
    return;
  }

  await run(userVersion, db);

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
