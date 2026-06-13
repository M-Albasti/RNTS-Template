/**
 * TypeScript types for SQLite layer.
 * These describe the SHAPE of data — not runtime validation (use Zod elsewhere if needed).
 */
import type {TodosState} from '@redux/slices/todosSlice';

/** One entry in the migrations list (see migrations.ts). */
export type SqliteMigration = {
  version: number;
  name: string;
  sql: string[];
};

/**
 * Shape of one row returned from `SELECT * FROM todos`.
 * Matches column names in schema.ts (snake_case).
 */
export type TodoRow = {
  id: string;
  title: string;
  done: number;
  priority: string;
  category: string;
  due_date: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

/** Todo UI settings stored in slice_snapshots under key `todos_meta`. */
export type PersistedTodosMeta = Pick<TodosState, 'filter' | 'focusMinutes'>;
