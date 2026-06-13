/**
 * Loads SQLite data into Redux memory on app startup.
 *
 * Called once from bootstrapSQLite() in init.ts.
 */
import type {Dispatch, UnknownAction} from '@reduxjs/toolkit';

import {hydrateTodos} from '@redux/slices/todosSlice';
import type {RootState} from '@Types/rootState';

import {loadTodosStateFromSQLite, saveTodosStateToSQLite} from './todosSync';

export const hydrateReduxFromSQLite = (
  dispatch: Dispatch<UnknownAction>,
  getState: () => RootState,
): void => {
  const savedTodos = loadTodosStateFromSQLite();

  if (savedTodos) {
    // Existing user: replace Redux todos with what was saved on disk.
    dispatch(hydrateTodos(savedTodos));
    return;
  }

  // First launch: copy Redux default todos INTO SQLite so they survive restart.
  saveTodosStateToSQLite(getState().todos);
};
