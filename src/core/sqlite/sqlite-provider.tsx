import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import {
  SQLiteProvider as SQLiteProviderLib,
  useSQLiteContext,
} from 'expo-sqlite';
import React from 'react';

import { doInit } from './sqlite';

interface Props {
  children: React.ReactNode;
}

export function SQLiteProvider({ children }: Props) {
  return (
    <SQLiteProviderLib databaseName="test.db" onInit={doInit}>
      <ChildrenContainer>{children}</ChildrenContainer>
    </SQLiteProviderLib>
  );
}

function ChildrenContainer({ children }: Props) {
  const db = useSQLiteContext();
  useDrizzleStudio(db);
  return <>{children}</>;
}
