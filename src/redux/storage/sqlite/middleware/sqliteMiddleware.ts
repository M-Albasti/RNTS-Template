/**
 * Redux middleware — automatically persists todos to SQLite.
 *
 * Middleware runs on EVERY Redux action. We only save when a todo-related
 * action fires, and we save AFTER the reducer runs (`next(action)` first).
 *
 * Registered in store.tsx via `.concat(sqliteMiddleware)`.
 */
import type {Middleware, UnknownAction} from '@reduxjs/toolkit';

import {
  addTodo,
  removeTodo,
  setFocusMinutes,
  setPriority,
  setTodoFilter,
  toggleTodo,
  type TodosState,
} from '@redux/slices/todosSlice';

import {saveTodosStateToSQLite} from '../sync/todosSync';

/** Actions that change todo data and should trigger a SQLite write. */
const todosPersistenceActions = [
  addTodo,
  toggleTodo,
  removeTodo,
  setPriority,
  setTodoFilter,
  setFocusMinutes,
] as const;

const shouldPersistTodos = (action: UnknownAction): boolean =>
  todosPersistenceActions.some(matcher => matcher.match(action));

export const sqliteMiddleware: Middleware = store => next => action => {
  const result = next(action);

  if (shouldPersistTodos(action as UnknownAction)) {
    try {
      const state = store.getState() as {todos: TodosState};
      saveTodosStateToSQLite(state.todos);
    } catch (error) {
      console.log('SQLite todos sync Error =>', error);
    }
  }

  return result;
};
