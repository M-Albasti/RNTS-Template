import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {
  BillPayItem,
  BudgetCategory,
  SavingsGoal,
  WalletCard,
  WalletTransaction,
} from '@Types/walletTypes';

export type WalletState = {
  balance: number;
  cardLast4: string;
  cards: WalletCard[];
  transactions: WalletTransaction[];
  bills: BillPayItem[];
  savingsGoals: SavingsGoal[];
  budgetCategories: BudgetCategory[];
};

const initialState: WalletState = {
  balance: 2480.5,
  cardLast4: '4291',
  cards: [
    {id: '1', label: 'Primary Visa', last4: '4291', brand: 'Visa', isDefault: true},
    {id: '2', label: 'Backup Mastercard', last4: '8834', brand: 'Mastercard', isDefault: false},
  ],
  transactions: [
    {
      id: '1',
      title: 'Salary',
      amount: 3200,
      type: 'credit',
      date: '2026-06-01',
      category: 'Income',
      note: 'Monthly payroll deposit',
    },
    {
      id: '2',
      title: 'Coffee Shop',
      amount: 12.5,
      type: 'debit',
      date: '2026-06-03',
      category: 'Food',
      note: 'Morning latte',
    },
    {
      id: '3',
      title: 'Mobile Plan',
      amount: 45,
      type: 'debit',
      date: '2026-06-05',
      category: 'Utilities',
      note: 'June billing cycle',
    },
    {
      id: '4',
      title: 'Freelance payout',
      amount: 850,
      type: 'credit',
      date: '2026-06-08',
      category: 'Income',
      note: 'Design project milestone',
    },
  ],
  bills: [
    {id: 'b1', payee: 'Electric Company', amount: 89, dueDate: '2026-06-20', recurring: true, paid: false},
    {id: 'b2', payee: 'Internet Provider', amount: 55, dueDate: '2026-06-18', recurring: true, paid: false},
    {id: 'b3', payee: 'Rent', amount: 1200, dueDate: '2026-07-01', recurring: true, paid: false},
  ],
  savingsGoals: [
    {id: 'g1', title: 'Vacation fund', target: 3000, saved: 1200},
    {id: 'g2', title: 'Emergency fund', target: 5000, saved: 2480},
  ],
  budgetCategories: [
    {id: 'bc1', name: 'Food', limit: 400, spent: 128},
    {id: 'bc2', name: 'Transport', limit: 200, spent: 65},
    {id: 'bc3', name: 'Entertainment', limit: 150, spent: 42},
    {id: 'bc4', name: 'Utilities', limit: 300, spent: 134},
  ],
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    transfer: (
      state,
      action: PayloadAction<{title: string; amount: number; note?: string}>,
    ) => {
      if (state.balance >= action.payload.amount) {
        state.balance -= action.payload.amount;
        state.transactions.unshift({
          id: Date.now().toString(),
          title: action.payload.title,
          amount: action.payload.amount,
          type: 'debit',
          date: new Date().toISOString().slice(0, 10),
          category: 'Transfer',
          note: action.payload.note,
        });
      }
    },
    requestMoney: (state, action: PayloadAction<{from: string; amount: number}>) => {
      state.balance += action.payload.amount;
      state.transactions.unshift({
        id: Date.now().toString(),
        title: `Request from ${action.payload.from}`,
        amount: action.payload.amount,
        type: 'credit',
        date: new Date().toISOString().slice(0, 10),
        category: 'Request',
        note: 'Money request accepted',
      });
    },
    qrPay: (state, action: PayloadAction<{merchant: string; amount: number}>) => {
      if (state.balance >= action.payload.amount) {
        state.balance -= action.payload.amount;
        state.transactions.unshift({
          id: Date.now().toString(),
          title: action.payload.merchant,
          amount: action.payload.amount,
          type: 'debit',
          date: new Date().toISOString().slice(0, 10),
          category: 'QR Pay',
        });
        const food = state.budgetCategories.find(c => c.name === 'Food');
        if (food) food.spent += action.payload.amount;
      }
    },
    payBill: (state, action: PayloadAction<string>) => {
      const bill = state.bills.find(b => b.id === action.payload);
      if (bill && !bill.paid && state.balance >= bill.amount) {
        bill.paid = true;
        state.balance -= bill.amount;
        state.transactions.unshift({
          id: Date.now().toString(),
          title: bill.payee,
          amount: bill.amount,
          type: 'debit',
          date: new Date().toISOString().slice(0, 10),
          category: 'Bills',
          note: 'Bill payment',
        });
      }
    },
    topUp: (state, action: PayloadAction<number>) => {
      state.balance += action.payload;
      state.transactions.unshift({
        id: Date.now().toString(),
        title: 'Top up',
        amount: action.payload,
        type: 'credit',
        date: new Date().toISOString().slice(0, 10),
        category: 'Deposit',
        note: 'Wallet top-up',
      });
    },
    contributeToGoal: (
      state,
      action: PayloadAction<{goalId: string; amount: number}>,
    ) => {
      const goal = state.savingsGoals.find(g => g.id === action.payload.goalId);
      if (goal && state.balance >= action.payload.amount) {
        state.balance -= action.payload.amount;
        goal.saved = Math.min(goal.target, goal.saved + action.payload.amount);
      }
    },
    setDefaultCard: (state, action: PayloadAction<string>) => {
      state.cards.forEach(card => {
        card.isDefault = card.id === action.payload;
      });
      const selected = state.cards.find(c => c.id === action.payload);
      if (selected) state.cardLast4 = selected.last4;
    },
  },
});

export const {
  transfer,
  requestMoney,
  qrPay,
  payBill,
  topUp,
  contributeToGoal,
  setDefaultCard,
} = walletSlice.actions;
export default walletSlice.reducer;
