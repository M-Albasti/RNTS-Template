import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {TodoFilter, TodoItem, TodoPriority} from '@Types/todoTypes';

export type TodosState = {
  items: TodoItem[];
  filter: TodoFilter;
  focusMinutes: number;
};

const initialState: TodosState = {
  items: [
    {
      id: '1',
      title: 'Review home dashboard design',
      done: true,
      priority: 'medium',
      category: 'Work',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Test wallet transfer flow',
      done: false,
      priority: 'high',
      category: 'Work',
      dueDate: '2026-06-15',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Ship chat MVP',
      done: false,
      priority: 'high',
      category: 'Work',
      dueDate: '2026-06-14',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Grocery shopping',
      done: false,
      priority: 'low',
      category: 'Personal',
      dueDate: '2026-06-13',
      createdAt: new Date().toISOString(),
    },
  ],
  filter: 'all',
  focusMinutes: 25,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<TodoItem>) => {
      state.items.unshift(action.payload);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const item = state.items.find(t => t.id === action.payload);
      if (item) item.done = !item.done;
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    setPriority: (
      state,
      action: PayloadAction<{id: string; priority: TodoPriority}>,
    ) => {
      const item = state.items.find(t => t.id === action.payload.id);
      if (item) item.priority = action.payload.priority;
    },
    setTodoFilter: (state, action: PayloadAction<TodoFilter>) => {
      state.filter = action.payload;
    },
    setFocusMinutes: (state, action: PayloadAction<number>) => {
      state.focusMinutes = action.payload;
    },
    hydrateTodos: (_state, action: PayloadAction<TodosState>) => action.payload,
    // ^ Called once on startup by hydrateReduxFromSQLite — replaces entire todos slice from SQLite.
  },
});

export const {addTodo, toggleTodo, removeTodo, setPriority, setTodoFilter, setFocusMinutes, hydrateTodos} =
  todosSlice.actions;
export default todosSlice.reducer;
