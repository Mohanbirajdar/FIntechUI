export type TransactionType = "income" | "expense";
export type UserRole = "admin" | "user";
export type Theme = "dark" | "light";

export type Category =
  | "Food & Dining"
  | "Transportation"
  | "Shopping"
  | "Entertainment"
  | "Bills & Utilities"
  | "Health & Medical"
  | "Travel"
  | "Education"
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Other";

export const CATEGORIES: Category[] = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health & Medical",
  "Travel",
  "Education",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];

export const EXPENSE_CATEGORIES: Category[] = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health & Medical",
  "Travel",
  "Education",
  "Other",
];

export const INCOME_CATEGORIES: Category[] = [
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];

export const CATEGORY_ICONS: Record<Category, string> = {
  "Food & Dining": "🍕",
  "Transportation": "🚗",
  "Shopping": "🛍️",
  "Entertainment": "🎬",
  "Bills & Utilities": "⚡",
  "Health & Medical": "🏥",
  "Travel": "✈️",
  "Education": "📚",
  "Salary": "💼",
  "Freelance": "💻",
  "Investment": "📈",
  "Other": "💰",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  "Food & Dining": "#f59e0b",
  "Transportation": "#3b82f6",
  "Shopping": "#ec4899",
  "Entertainment": "#8b5cf6",
  "Bills & Utilities": "#06b6d4",
  "Health & Medical": "#10b981",
  "Travel": "#f97316",
  "Education": "#6366f1",
  "Salary": "#22c55e",
  "Freelance": "#14b8a6",
  "Investment": "#a855f7",
  "Other": "#94a3b8",
};

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: Category;
  type: TransactionType;
  notes: string;
  isAnomalous?: boolean;
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
}

export interface OnboardingData {
  fullName: string;
  age: string;
  email: string;
  phone: string;
  monthlyIncome: number;
  savingsGoal: number;
  selectedCategories: Category[];
  budgets: Record<Category, number>;
  completed: boolean;
}

export interface UserProfile extends OnboardingData {
  role: UserRole;
  theme: Theme;
  joinedAt: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface SpendingPersonality {
  type: "Saver" | "Spender" | "Balanced";
  description: string;
  score: number;
}

export interface Filters {
  search: string;
  category: Category | "all";
  type: TransactionType | "all";
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}
