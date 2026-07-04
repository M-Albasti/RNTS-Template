/**
 * Maps between Redux `TodosState` and SQLite tables.
 *
 * - `items` → rows in `todos` table
 * - `filter` + `focusMinutes` → JSON in `slice_snapshots` (key: todos_meta)
 */
import type {TodosState} from '@redux/slices/todosSlice';

import {
  getAllTodos,
  getTodosMeta,
  replaceAllTodos,
  saveTodosMeta,
} from '../repositories/todosRepository';

/** Reads full todos slice from SQLite. Returns null if DB is empty (first launch). */
export const loadTodosStateFromSQLite = (): TodosState | null => {
  const items = getAllTodos();
  const meta = getTodosMeta();

  if (items.length === 0 && !meta) {
    return null;
  }

  return {
    items,
    filter: meta?.filter ?? 'all',
    focusMinutes: meta?.focusMinutes ?? 25,
  };
};

/** Writes full todos slice to SQLite (called after every todo Redux action). */
export const saveTodosStateToSQLite = (state: TodosState): void => {
  replaceAllTodos(state.items);
  saveTodosMeta({
    filter: state.filter,
    focusMinutes: state.focusMinutes,
  });
};
