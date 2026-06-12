export type TodoPriority = 'low' | 'medium' | 'high';

export type TodoFilter = 'all' | 'active' | 'done' | 'high';

export type TodoItem = {
  id: string;
  title: string;
  done: boolean;
  priority: TodoPriority;
  category: string;
  dueDate?: string;
  note?: string;
  createdAt: string;
};
