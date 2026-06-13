/**
 * Migration registry — add new versions here when the schema changes.
 *
 * RULE: Never edit an old migration after it ships to users.
 * Always add a NEW version (2, 3, …) with ALTER TABLE or new CREATE statements.
 */
import {
  KV_STORE_TABLE,
  SCHEMA_MIGRATIONS_TABLE,
  SLICE_SNAPSHOTS_TABLE,
  TODOS_DONE_INDEX,
  TODOS_PRIORITY_INDEX,
  TODOS_TABLE,
} from './schema';
import type {SqliteMigration} from './types';

export const SQLITE_MIGRATIONS: SqliteMigration[] = [
  {
    version: 1,
    name: 'initial_schema',
    sql: [
      SCHEMA_MIGRATIONS_TABLE,
      KV_STORE_TABLE,
      TODOS_TABLE,
      SLICE_SNAPSHOTS_TABLE,
      TODOS_DONE_INDEX,
      TODOS_PRIORITY_INDEX,
    ],
  },
];
