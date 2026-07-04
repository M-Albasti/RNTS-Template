/**
 * Todo CRUD — reads/writes the `todos` table and `todos_meta` snapshot.
 *
 * This is the lowest layer for todo persistence. Higher layers:
 *   todosSync.ts → maps TodosState ↔ these functions
 *   sqliteMiddleware.ts → calls todosSync after Redux actions
 */
import type {TodoItem} from '@Types/todoTypes';

import {getDatabase, runInTransaction} from '../database';
import type {PersistedTodosMeta, TodoRow} from '../types';

const nowIso = (): string => new Date().toISOString();

/** Convert a SQL row (snake_case) to app TodoItem (camelCase). */
const rowToTodo = (row: TodoRow): TodoItem => ({
  id: row.id,
  title: row.title,
  done: row.done === 1,
  priority: row.priority as TodoItem['priority'],
  category: row.category,
  dueDate: row.due_date ?? undefined,
  note: row.note ?? undefined,
  createdAt: row.created_at,
});

/** Build INSERT parameter array in column order. Last value is always fresh updated_at. */
const todoToParams = (todo: TodoItem): (string | number | null)[] => [
  todo.id,
  todo.title,
  todo.done ? 1 : 0,
  todo.priority,
  todo.category,
  todo.dueDate ?? null,
  todo.note ?? null,
  todo.createdAt,
  nowIso(),
];

/** SELECT all todos, newest first. */
export const getAllTodos = (): TodoItem[] => {
  const result = getDatabase().executeSync(
    `SELECT id, title, done, priority, category, due_date, note, created_at, updated_at
     FROM todos
     ORDER BY datetime(created_at) DESC`,
  );

  return result.rows.map(row => rowToTodo(row as TodoRow));
};

/** INSERT one todo or UPDATE if id already exists (upsert). */
export const upsertTodo = (todo: TodoItem): void => {
  getDatabase().executeSync(
    `INSERT INTO todos (
      id, title, done, priority, category, due_date, note, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      done = excluded.done,
      priority = excluded.priority,
      category = excluded.category,
      due_date = excluded.due_date,
      note = excluded.note,
      updated_at = excluded.updated_at`,
    todoToParams(todo),
  );
};

/** DELETE one todo by id. */
export const deleteTodo = (id: string): void => {
  getDatabase().executeSync('DELETE FROM todos WHERE id = ?', [id]);
};

/**
 * Full replace: delete ALL rows, insert current list.
 * Wrapped in a transaction so a crash mid-write won't leave an empty table.
 */
export const replaceAllTodos = (items: TodoItem[]): void => {
  runInTransaction(db => {
    db.executeSync('DELETE FROM todos');

    for (const todo of items) {
      db.executeSync(
        `INSERT INTO todos (
          id, title, done, priority, category, due_date, note, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        todoToParams(todo),
      );
    }
  });
};

/** Read todos UI settings from slice_snapshots. */
export const getTodosMeta = (): PersistedTodosMeta | null => {
  const result = getDatabase().executeSync(
    'SELECT payload FROM slice_snapshots WHERE slice_key = ?',
    ['todos_meta'],
  );

  const payload = result.rows[0]?.payload;
  if (typeof payload !== 'string') {
    return null;
  }

  try {
    return JSON.parse(payload) as PersistedTodosMeta;
  } catch {
    return null;
  }
};

/** Save todos UI settings (filter, focusMinutes) as JSON. */
export const saveTodosMeta = (meta: PersistedTodosMeta): void => {
  getDatabase().executeSync(
    `INSERT INTO slice_snapshots (slice_key, payload, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(slice_key) DO UPDATE SET
       payload = excluded.payload,
       updated_at = excluded.updated_at`,
    ['todos_meta', JSON.stringify(meta), nowIso()],
  );
};

/** Remove all todo rows and todos_meta (used by clearSQLiteData). */
export const clearTodosData = (): void => {
  const db = getDatabase();
  db.executeSync('DELETE FROM todos');
  db.executeSync('DELETE FROM slice_snapshots WHERE slice_key = ?', ['todos_meta']);
};
