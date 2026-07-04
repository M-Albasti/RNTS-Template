/**
 * SQL table definitions for `rnts_app.sqlite`.
 *
 * Each export is a full `CREATE TABLE` or `CREATE INDEX` statement string.
 * These strings are NOT executed here — `migrationRunner.ts` runs them at startup.
 *
 * Naming convention: DB columns use snake_case (`due_date`, `created_at`).
 * TypeScript app models use camelCase (`dueDate`, `createdAt`).
 * Repositories convert between the two.
 */
export const SQLITE_DB_NAME = 'rnts_app.sqlite';

/** Tracks which migration versions have already been applied. */
export const SCHEMA_MIGRATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    applied_at TEXT NOT NULL
  );
`;

/** Generic string key → string value store (JSON strings allowed in `value`). */
export const KV_STORE_TABLE = `
  CREATE TABLE IF NOT EXISTS kv_store (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  ) WITHOUT ROWID;
`;

/** One row per todo item. `done` is 0 or 1 (SQLite has no native boolean type). */
export const TODOS_TABLE = `
  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    priority TEXT NOT NULL,
    category TEXT NOT NULL,
    due_date TEXT,
    note TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

/** Stores JSON blobs for slice-level settings (e.g. todos filter + focus timer). */
export const SLICE_SNAPSHOTS_TABLE = `
  CREATE TABLE IF NOT EXISTS slice_snapshots (
    slice_key TEXT PRIMARY KEY NOT NULL,
    payload TEXT NOT NULL,
    updated_at TEXT NOT NULL
  ) WITHOUT ROWID;
`;

/** Speeds up queries like "show only completed todos". */
export const TODOS_DONE_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_todos_done ON todos (done);
`;

export const TODOS_PRIORITY_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos (priority);
`;
