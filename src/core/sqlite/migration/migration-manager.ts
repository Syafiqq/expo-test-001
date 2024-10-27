import type { SQLiteDatabase } from 'expo-sqlite';

import { run as v0Run } from './migration-v0';
import { run as v1Run } from './migration-v1';
import { run as v2Run } from './migration-v2';

const migrations: ((db: SQLiteDatabase) => Promise<void>)[] = [
  v0Run,
  v1Run,
  v2Run,
];

export async function run(currentVersion: number, db: SQLiteDatabase) {
  for (let i = currentVersion + 1; i < migrations.length; i++) {
    await migrations[i](db);
  }
}
