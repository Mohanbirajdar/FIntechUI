"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction, Filters, Category, TransactionType, Budget, Goal } from "@/types";
import { generateMockTransactions, DEFAULT_BUDGETS, DEFAULT_GOALS } from "@/lib/mockData";
import { generateId } from "@/lib/utils";

interface TransactionState {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  filters: Filters;
  selectedIds: string[];

  // Actions
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
  importTransactions: (txs: Transaction[]) => void;
  initializeMockData: () => void;

  // Filters
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;

  // Selection
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // Budgets
  updateBudget: (category: Category, limit: number) => void;

  // Goals
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Computed helpers
  getFilteredTransactions: () => Transaction[];
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getCategorySpending: () => Record<string, number>;
  getMonthlyData: () => { month: string; income: number; expenses: number; balance: number }[];
  getCurrentMonthBudgetUsage: () => Budget[];
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  category: "all",
  type: "all",
  dateFrom: "",
  dateTo: "",
  amountMin: "",
  amountMax: "",
  sortBy: "date",
  sortOrder: "desc",
};

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      budgets: DEFAULT_BUDGETS,
      goals: DEFAULT_GOALS,
      filters: DEFAULT_FILTERS,
      selectedIds: [],

      addTransaction: (tx) => {
        const newTx: Transaction = { ...tx, id: generateId() };
        set((s) => ({ transactions: [newTx, ...s.transactions] }));
      },

      updateTransaction: (id, tx) => {
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...tx } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
          selectedIds: s.selectedIds.filter((sid) => sid !== id),
        }));
      },

      bulkDelete: (ids) => {
        set((s) => ({
          transactions: s.transactions.filter((t) => !ids.includes(t.id)),
          selectedIds: [],
        }));
      },

      importTransactions: (txs) => {
        set((s) => ({
          transactions: [...txs, ...s.transactions].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        }));
      },

      initializeMockData: () => {
        const existing = get().transactions;
        if (existing.length === 0) {
          set({ transactions: generateMockTransactions() });
        }
      },

      setFilter: (key, value) => {
        set((s) => ({ filters: { ...s.filters, [key]: value } }));
      },

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      toggleSelect: (id) => {
        set((s) => ({
          selectedIds: s.selectedIds.includes(id)
            ? s.selectedIds.filter((sid) => sid !== id)
            : [...s.selectedIds, id],
        }));
      },

      selectAll: (ids) => set({ selectedIds: ids }),
      clearSelection: () => set({ selectedIds: [] }),

      updateBudget: (category, limit) => {
        set((s) => ({
          budgets: s.budgets.map((b) =>
            b.category === category ? { ...b, limit } : b
          ),
        }));
      },

      addGoal: (goal) => {
        set((s) => ({ goals: [...s.goals, { ...goal, id: generateId() }] }));
      },

      updateGoal: (id, goal) => {
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...goal } : g)),
        }));
      },

      deleteGoal: (id) => {
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
      },

      getFilteredTransactions: () => {
        const { transactions, filters } = get();
        let result = [...transactions];

        if (filters.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (t) =>
              t.notes.toLowerCase().includes(q) ||
              t.category.toLowerCase().includes(q)
          );
        }
        if (filters.category !== "all") {
          result = result.filter((t) => t.category === filters.category);
        }
        if (filters.type !== "all") {
          result = result.filter((t) => t.type === filters.type);
        }
        if (filters.dateFrom) {
          result = result.filter((t) => t.date >= filters.dateFrom);
        }
        if (filters.dateTo) {
          result = result.filter((t) => t.date <= filters.dateTo);
        }
        if (filters.amountMin) {
          result = result.filter((t) => t.amount >= Number(filters.amountMin));
        }
        if (filters.amountMax) {
          result = result.filter((t) => t.amount <= Number(filters.amountMax));
        }

        result.sort((a, b) => {
          if (filters.sortBy === "date") {
            const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
            return filters.sortOrder === "asc" ? diff : -diff;
          } else {
            const diff = a.amount - b.amount;
            return filters.sortOrder === "asc" ? diff : -diff;
          }
        });

        return result;
      },

      getTotalIncome: () =>
        get().transactions
          .filter((t) => t.type === "income")
          .reduce((s, t) => s + t.amount, 0),

      getTotalExpenses: () =>
        get().transactions
          .filter((t) => t.type === "expense")
          .reduce((s, t) => s + t.amount, 0),

      getBalance: () => get().getTotalIncome() - get().getTotalExpenses(),

      getCategorySpending: () => {
        const spending: Record<string, number> = {};
        get()
          .transactions.filter((t) => t.type === "expense")
          .forEach((t) => {
            spending[t.category] = (spending[t.category] || 0) + t.amount;
          });
        return spending;
      },

      getMonthlyData: () => {
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthStr = d.toLocaleString("en-IN", { month: "short", year: "2-digit" });
          const year = d.getFullYear();
          const month = d.getMonth();

          const monthTxns = get().transactions.filter((t) => {
            const td = new Date(t.date);
            return td.getFullYear() === year && td.getMonth() === month;
          });

          const income = monthTxns
            .filter((t) => t.type === "income")
            .reduce((s, t) => s + t.amount, 0);
          const expenses = monthTxns
            .filter((t) => t.type === "expense")
            .reduce((s, t) => s + t.amount, 0);

          months.push({ month: monthStr, income, expenses, balance: income - expenses });
        }
        return months;
      },

      getCurrentMonthBudgetUsage: () => {
        const now = new Date();
        const thisMonthTxns = get().transactions.filter((t) => {
          const d = new Date(t.date);
          return (
            t.type === "expense" &&
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth()
          );
        });

        return get().budgets.map((b) => {
          const spent = thisMonthTxns
            .filter((t) => t.category === b.category)
            .reduce((s, t) => s + t.amount, 0);
          return { ...b, spent };
        });
      },
    }),
    {
      name: "fintech-transactions",
      partialize: (state) => ({
        transactions: state.transactions,
        budgets: state.budgets,
        goals: state.goals,
      }),
    }
  )
);
