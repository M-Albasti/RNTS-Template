/**
 * Applies pending schema migrations on app startup.
 *
 * Flow:
 * 1. Read applied versions from `schema_migrations` table
 * 2. For each migration in SQLITE_MIGRATIONS not yet applied:
 *    - Run every SQL statement in migration.sql
 *    - Insert a row recording that version is done
 */
import {getDatabase} from './database';
import {SQLITE_MIGRATIONS} from './migrations';

const nowIso = (): string => new Date().toISOString();

/** Returns a Set of migration version numbers already recorded in the DB. */
const getAppliedVersions = (): Set<number> => {
  const db = getDatabase();

  // Bootstrap the migrations table before we can query it (first launch only).
  db.executeSync(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );`,
  );

  const result = db.executeSync(
    'SELECT version FROM schema_migrations ORDER BY version ASC',
  );

  return new Set(
    result.rows
      .map(row => row.version)
      .filter((version): version is number => typeof version === 'number'),
  );
};

/** Runs all migrations whose version is not yet in schema_migrations. */
export const runMigrations = (): void => {
  const applied = getAppliedVersions();
  const db = getDatabase();

  for (const migration of SQLITE_MIGRATIONS) {
    if (applied.has(migration.version)) {
      continue;
    }

    for (const statement of migration.sql) {
      db.executeSync(statement);
    }

    db.executeSync(
      'INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)',
      [migration.version, migration.name, nowIso()],
    );
  }
};

/** Highest applied migration version, or 0 if none. */
export const getCurrentSchemaVersion = (): number => {
  const applied = getAppliedVersions();
  if (applied.size === 0) {
    return 0;
  }

  return Math.max(...applied);
};
