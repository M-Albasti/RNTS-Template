# SQLite Storage — Complete Guide (Beginner Friendly)

This folder connects **SQLite** (a local SQL database on the device) to **Redux** (in-memory app state).

**Library used:** [`@op-engineering/op-sqlite`](https://op-engineering.github.io/op-sqlite/) — fast native SQLite for React Native.

**Database file on device:** `rnts_app.sqlite`

---

## Table of contents

1. [Big picture — what happens when the app starts](#1-big-picture--what-happens-when-the-app-starts)
2. [Folder map — every file explained](#2-folder-map--every-file-explained)
3. [Database tables](#3-database-tables)
4. [Data flow diagrams](#4-data-flow-diagrams)
5. [Line-by-line file walkthrough](#5-line-by-line-file-walkthrough)
6. [How Redux + MMKV + SQLite work together](#6-how-redux--mmkv--sqlite-work-together)
7. [Public API cheat sheet](#7-public-api-cheat-sheet)
8. [How to extend (add a new table / slice)](#8-how-to-extend-add-a-new-table--slice)
9. [Verification checklist](#9-verification-checklist)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Big picture — what happens when the app starts

```
App.tsx mounts
    │
    ▼
bootstrapSQLite(store.dispatch, store.getState)
    │
    ├─ initializeSQLite()
    │     ├─ openDatabase()          → opens rnts_app.sqlite
    │     └─ runMigrations()         → creates tables if first launch
    │
    └─ hydrateReduxFromSQLite()
          ├─ IF saved todos exist in SQLite
          │     └─ dispatch(hydrateTodos(saved))  → Redux shows saved data
          └─ ELSE (first launch)
                └─ saveTodosStateToSQLite(initial Redux todos)  → seed DB

User interacts with todos (add / toggle / delete / filter / focus timer)
    │
    ▼
Redux reducer updates in-memory state
    │
    ▼
sqliteMiddleware (runs AFTER each todo action)
    │
    └─ saveTodosStateToSQLite(state.todos)  → writes back to SQLite
```

**Important:** Todos are **not** saved by MMKV/redux-persist. They live only in SQLite (`store.tsx` blacklists `'todos'`).

---

## 2. Folder map — every file explained

| File | Role |
|------|------|
| `schema.ts` | SQL `CREATE TABLE` strings — the blueprint of the database |
| `types.ts` | TypeScript types for DB rows and migrations |
| `migrations.ts` | List of schema versions (v1 = initial tables) |
| `migrationRunner.ts` | Applies migrations that haven't run yet |
| `database.ts` | Opens/closes DB, transactions, PRAGMA settings |
| `keyValueStore.ts` | Generic key → JSON string storage (`kv_store` table) |
| `repositories/todosRepository.ts` | CRUD for todo rows + todo meta snapshot |
| `repositories/sliceSnapshotRepository.ts` | Generic JSON blobs per Redux slice key |
| `sync/todosSync.ts` | Converts between `TodosState` ↔ SQLite |
| `sync/hydrateFromSQLite.ts` | Loads SQLite data into Redux on startup |
| `middleware/sqliteMiddleware.ts` | Auto-saves todos after Redux actions |
| `init.ts` | `initializeSQLite`, `bootstrapSQLite`, clear/reset helpers |
| `index.ts` | Barrel export — import from `@redux/storage/sqlite` |
| `../sqliteStorage.tsx` | Optional MMKV-compatible wrapper over `kv_store` |

**Related files outside this folder:**

| File | Role |
|------|------|
| `App.tsx` | Calls `bootstrapSQLite` on mount |
| `src/redux/store.tsx` | Registers `sqliteMiddleware`, `clearAllStorage` |
| `src/redux/slices/todosSlice.tsx` | Todo Redux state + `hydrateTodos` action |

---

## 3. Database tables

### `schema_migrations`

Tracks which migration scripts already ran (so we never create tables twice).

| Column | Type | Meaning |
|--------|------|---------|
| `version` | INTEGER PK | Migration number (1, 2, 3…) |
| `name` | TEXT | Human label (`initial_schema`) |
| `applied_at` | TEXT | ISO timestamp when applied |

### `kv_store`

Simple key-value storage (like a mini AsyncStorage inside SQLite).

| Column | Type | Meaning |
|--------|------|---------|
| `key` | TEXT PK | Storage key |
| `value` | TEXT | String value (often JSON) |
| `updated_at` | TEXT | Last write time |

Used by `sqliteStorage.tsx` if you switch redux-persist from MMKV to SQLite.

### `todos`

Structured todo items (one row per todo).

| Column | Type | Meaning |
|--------|------|---------|
| `id` | TEXT PK | Unique todo id |
| `title` | TEXT | Todo text |
| `done` | INTEGER | `0` = false, `1` = true (SQLite has no boolean) |
| `priority` | TEXT | `low` / `medium` / `high` |
| `category` | TEXT | e.g. `Work`, `Personal` |
| `due_date` | TEXT NULL | Optional ISO date string |
| `note` | TEXT NULL | Optional note |
| `created_at` | TEXT | When todo was created |
| `updated_at` | TEXT | Last modification time |

### `slice_snapshots`

Stores JSON blobs for slice settings that aren't separate columns.

| Column | Type | Meaning |
|--------|------|---------|
| `slice_key` | TEXT PK | e.g. `todos_meta` |
| `payload` | TEXT | JSON string |
| `updated_at` | TEXT | Last write time |

Currently stores `{ filter, focusMinutes }` for the todos screen.

---

## 4. Data flow diagrams

### Read path (app launch)

```
SQLite todos table
    → getAllTodos()           // SQL SELECT
    → rowToTodo()             // snake_case DB row → camelCase TodoItem
    → loadTodosStateFromSQLite()
    → dispatch(hydrateTodos)  // Redux state replaced
    → UI renders saved todos
```

### Write path (user toggles a todo)

```
User taps checkbox
    → dispatch(toggleTodo(id))
    → todosSlice reducer updates state.items[x].done
    → sqliteMiddleware runs saveTodosStateToSQLite()
    → replaceAllTodos() inside a TRANSACTION
          DELETE FROM todos
          INSERT each item from Redux
    → SQLite file updated on disk
```

---

## 5. Line-by-line file walkthrough

### `schema.ts`

```ts
export const SQLITE_DB_NAME = 'rnts_app.sqlite';
```
→ Filename stored in the app's private database directory.

```ts
export const SCHEMA_MIGRATIONS_TABLE = `CREATE TABLE IF NOT EXISTS schema_migrations (...)`;
```
→ `IF NOT EXISTS` = safe to run multiple times.

```ts
) WITHOUT ROWID;
```
→ Optimization for tables where the primary key is the only lookup column (`kv_store`, `slice_snapshots`).

```ts
done INTEGER NOT NULL DEFAULT 0
```
→ SQLite stores booleans as 0/1 integers.

---

### `database.ts`

```ts
let database: DB | null = null;
```
→ Singleton pattern: one connection for the whole app.

```ts
database = open({name: SQLITE_DB_NAME});
```
→ Native module opens/creates the file.

```ts
database.executeSync('PRAGMA journal_mode = WAL;');
```
→ WAL mode = better read performance while writing.

```ts
runInTransaction(fn)
```
→ `BEGIN IMMEDIATE` … work … `COMMIT` or `ROLLBACK` on error. Prevents half-deleted todo lists.

---

### `migrationRunner.ts`

```ts
const getAppliedVersions = (): Set<number> => { ... }
```
→ Reads `schema_migrations` table, returns which version numbers already ran.

```ts
for (const migration of SQLITE_MIGRATIONS) {
  if (applied.has(migration.version)) continue;
  for (const statement of migration.sql) {
    db.executeSync(statement);
  }
  db.executeSync('INSERT INTO schema_migrations ...');
}
```
→ For each new migration: run all SQL statements, then record the version.

**Adding migration v2 later:** append to `SQLITE_MIGRATIONS` in `migrations.ts` with `version: 2`.

---

### `keyValueStore.ts`

```ts
'SELECT value FROM kv_store WHERE key = ?', [key]
```
→ `?` is replaced by `key` safely (parameterized query).

```ts
ON CONFLICT(key) DO UPDATE SET value = excluded.value
```
→ Upsert: insert new key OR update existing key.

```ts
kvGetJson / kvSetJson
```
→ Convenience: object ↔ JSON string ↔ SQLite TEXT column.

---

### `repositories/todosRepository.ts`

```ts
const rowToTodo = (row: TodoRow): TodoItem => ({
  done: row.done === 1,           // integer → boolean
  dueDate: row.due_date ?? undefined,  // null → undefined for TS optional fields
});
```
→ Maps SQL naming (`snake_case`) to app naming (`camelCase`).

```ts
const todoToParams = (todo: TodoItem) => [ ... todo.done ? 1 : 0 ... nowIso() ]
```
→ Builds the `?` parameter array in the same order as the INSERT columns.

```ts
replaceAllTodos(items)
```
→ Full replace strategy: delete all rows, insert current Redux list. Simple and always consistent with Redux state.

---

### `sync/todosSync.ts`

```ts
if (items.length === 0 && !meta) return null;
```
→ First launch detection: empty DB → bootstrap will seed from Redux defaults.

```ts
saveTodosStateToSQLite(state)
  replaceAllTodos(state.items)
  saveTodosMeta({ filter, focusMinutes })
```
→ Items go to `todos` table; UI settings go to `slice_snapshots` as JSON.

---

### `sync/hydrateFromSQLite.ts`

```ts
if (savedTodos) {
  dispatch(hydrateTodos(savedTodos));
  return;
}
saveTodosStateToSQLite(getState().todos);
```
→ **Load** saved data OR **seed** defaults on first run.

---

### `middleware/sqliteMiddleware.ts`

Redux middleware shape: `store => next => action => { ... }`

```ts
const result = next(action);  // let reducer run FIRST
if (shouldPersistTodos(action)) {
  saveTodosStateToSQLite(store.getState().todos);
}
return result;
```
→ Persist **after** state update so SQLite always matches Redux.

```ts
const todosPersistenceActions = [addTodo, toggleTodo, ...]
```
→ Only these actions trigger a save (`hydrateTodos` is intentionally excluded).

---

### `init.ts`

| Function | When to use |
|----------|-------------|
| `initializeSQLite()` | Open DB + migrations only |
| `bootstrapSQLite(dispatch, getState)` | Full startup (called from App.tsx) |
| `isSQLiteReady()` | Check if init completed |
| `clearSQLiteData()` | Wipe rows, keep schema (used by `clearAllStorage`) |
| `resetSQLiteDatabase()` | Delete entire DB file |
| `closeSQLite()` | Close connection (rarely needed) |

---

### `../sqliteStorage.tsx`

Drop-in replacement for `@redux/storage/mmkv` with the same function names:

- `loadString` / `saveString`
- `load<T>` / `save`
- `remove` / `clear`

To use for redux-persist: uncomment the sqlite import in `store.tsx` and comment out MMKV.

**Requirement:** `initializeSQLite()` must run before redux-persist reads keys.

---

## 6. How Redux + MMKV + SQLite work together

| Data | Storage | Why |
|------|---------|-----|
| Auth, settings, posts, wallet, etc. | MMKV via redux-persist | Fast key-value snapshot of whole slices |
| Todos (items + filter + focus timer) | SQLite structured tables | Relational queries, scalable offline data |
| Auth tokens (network layer) | MMKV directly (`tokenStorage.ts`) | Separate from redux-persist |

This avoids **double persistence** (same todo data in MMKV and SQLite).

---

## 7. Public API cheat sheet

```ts
import {
  bootstrapSQLite,
  initializeSQLite,
  isSQLiteReady,
  getAllTodos,
  kvGetJson,
  kvSetJson,
  loadTodosStateFromSQLite,
  saveTodosStateToSQLite,
  clearSQLiteData,
  resetSQLiteDatabase,
  getCurrentSchemaVersion,
} from '@redux/storage/sqlite';
```

```ts
// Manual read (outside Redux)
const todos = getAllTodos();

// Manual write
saveTodosStateToSQLite(store.getState().todos);

// Generic key-value
kvSetJson('my_key', { foo: 'bar' });
const data = kvGetJson<{ foo: string }>('my_key');

// Wipe local SQL data (keeps tables)
clearSQLiteData();

// Nuclear option — delete DB file
resetSQLiteDatabase();
bootstrapSQLite(store.dispatch, store.getState); // re-init after reset
```

---

## 8. How to extend (add a new table / slice)

1. Add `CREATE TABLE` SQL to `schema.ts`.
2. Add it to `SQLITE_MIGRATIONS` as **version 2** (never edit v1 after release).
3. Create `repositories/myFeatureRepository.ts` with SELECT/INSERT/UPDATE/DELETE.
4. Create `sync/myFeatureSync.ts` to map DB rows ↔ Redux state.
5. Add middleware matchers OR call save from a Redux listener.
6. Blacklist that slice from redux-persist if SQLite is the source of truth.

---

## 9. Verification checklist

Run these on a **physical device or emulator** (SQLite is native — not available in web-only mode).

### First launch

- [ ] App opens without `SQLite bootstrap Error` in Metro logs
- [ ] Todo list shows 4 default seed items (from `todosSlice` initialState)
- [ ] After restart, same todos still appear (loaded from SQLite)

### Mutations persist

- [ ] Add a todo → kill app → reopen → new todo still there
- [ ] Toggle done → restart → done state preserved
- [ ] Delete todo → restart → stays deleted
- [ ] Change filter on todo list → restart → filter preserved
- [ ] Change focus timer minutes → restart → value preserved

### Clear storage

- [ ] Calling `clearAllStorage()` from settings (if wired) clears MMKV + SQLite todo rows

### Schema

- [ ] `getCurrentSchemaVersion()` returns `1` after first launch

---

## 10. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `SQLite is not initialized` | Used DB before `bootstrapSQLite` | Call `initializeSQLite()` first |
| Todos reset every launch | MMKV also persisting todos | Ensure `blacklist: ['todos']` in store |
| Native module error | op-sqlite not linked | Rebuild: `cd ios && pod install`, `bun run android` |
| Empty todo list after upgrade | Migration failed | Check Metro logs; may need `resetSQLiteDatabase()` in dev |
| Duplicate todo data | Both hydrate and persist fighting | Ensure `hydrateTodos` is NOT in middleware save list |

---

## SQL quick reference (for learning)

```sql
-- Read all todos
SELECT * FROM todos ORDER BY created_at DESC;

-- Read one
SELECT * FROM todos WHERE id = '1';

-- Insert
INSERT INTO todos (id, title, done, ...) VALUES (?, ?, 0, ...);

-- Update
UPDATE todos SET done = 1 WHERE id = '1';

-- Delete
DELETE FROM todos WHERE id = '1';

-- Key-value read
SELECT value FROM kv_store WHERE key = 'persist:root';
```

---

*Last updated: matches codebase in `src/redux/storage/sqlite/`.*
