export type TransactionType = 'credit' | 'debit';

export type WalletTransaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
  note?: string;
};

export type WalletCard = {
  id: string;
  label: string;
  last4: string;
  brand: string;
  isDefault: boolean;
};

export type BillPayItem = {
  id: string;
  payee: string;
  amount: number;
  dueDate: string;
  recurring: boolean;
  paid: boolean;
};

export type SavingsGoal = {
  id: string;
  title: string;
  target: number;
  saved: number;
};

export type BudgetCategory = {
  id: string;
  name: string;
  limit: number;
  spent: number;
};
