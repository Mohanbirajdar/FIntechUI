import { Transaction, Category, Budget, Goal } from "@/types";

const categories: Category[] = [
  "Food & Dining", "Transportation", "Shopping", "Entertainment",
  "Bills & Utilities", "Health & Medical", "Travel", "Education",
  "Salary", "Freelance", "Investment", "Other"
];

const notes: Record<string, string[]> = {
  "Food & Dining": ["Swiggy order", "Zomato delivery", "Restaurant dinner", "Coffee shop", "Grocery shopping", "McDonald's", "Domino's pizza"],
  "Transportation": ["Uber ride", "Ola cab", "Metro card recharge", "Petrol fill", "Bus ticket", "Auto rickshaw"],
  "Shopping": ["Amazon purchase", "Flipkart order", "Clothing store", "Electronics", "Books", "Sports gear"],
  "Entertainment": ["Netflix subscription", "Movie tickets", "Spotify", "Gaming", "Concert tickets", "OTT subscription"],
  "Bills & Utilities": ["Electricity bill", "Internet bill", "Mobile recharge", "Water bill", "Gas bill", "Insurance premium"],
  "Health & Medical": ["Doctor consultation", "Medicine", "Gym membership", "Health checkup", "Pharmacy"],
  "Travel": ["Flight tickets", "Hotel booking", "MakeMyTrip", "Holiday package", "Train ticket"],
  "Education": ["Online course", "Books", "Tuition fee", "Certification", "Workshop"],
  "Salary": ["Monthly salary", "Salary credit", "Performance bonus"],
  "Freelance": ["Client payment", "Project payment", "Consulting fee", "Design work"],
  "Investment": ["SIP payment", "Mutual fund", "Stock purchase", "FD interest", "Dividend"],
  "Other": ["Miscellaneous", "Gift", "Donation", "ATM withdrawal"],
};

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateTransaction(id: string, date: Date): Transaction {
  const isIncome = Math.random() < 0.2;
  const incomeCategories: Category[] = ["Salary", "Freelance", "Investment"];
  const expenseCategories: Category[] = ["Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills & Utilities", "Health & Medical", "Travel", "Education", "Other"];

  const category = isIncome
    ? incomeCategories[randomBetween(0, incomeCategories.length - 1)]
    : expenseCategories[randomBetween(0, expenseCategories.length - 1)];

  const amounts: Record<string, [number, number]> = {
    "Salary": [40000, 120000],
    "Freelance": [5000, 50000],
    "Investment": [500, 10000],
    "Food & Dining": [100, 2500],
    "Transportation": [50, 800],
    "Shopping": [500, 8000],
    "Entertainment": [200, 3000],
    "Bills & Utilities": [300, 3000],
    "Health & Medical": [200, 5000],
    "Travel": [2000, 20000],
    "Education": [500, 15000],
    "Other": [100, 2000],
  };

  const [min, max] = amounts[category] || [100, 2000];
  const amount = randomBetween(min, max);
  const noteList = notes[category] || ["Transaction"];
  const note = noteList[randomBetween(0, noteList.length - 1)];

  const isAnomalous = amount > max * 0.9 && Math.random() < 0.15;

  return {
    id,
    date: date.toISOString().split("T")[0],
    amount,
    category,
    type: isIncome ? "income" : "expense",
    notes: note,
    isAnomalous,
  };
}

export function generateMockTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  // Generate ~150 transactions over 6 months
  for (let i = 0; i < 150; i++) {
    const date = randomDate(sixMonthsAgo, now);
    transactions.push(generateTransaction(`txn_${i}_${Date.now()}`, date));
  }

  // Ensure monthly salaries
  for (let m = 0; m < 6; m++) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, randomBetween(1, 5));
    transactions.push({
      id: `salary_${m}`,
      date: d.toISOString().split("T")[0],
      amount: 75000,
      category: "Salary",
      type: "income",
      notes: "Monthly salary",
      isAnomalous: false,
    });
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const DEFAULT_BUDGETS: Budget[] = [
  { category: "Food & Dining", limit: 8000, spent: 0 },
  { category: "Transportation", limit: 3000, spent: 0 },
  { category: "Shopping", limit: 5000, spent: 0 },
  { category: "Entertainment", limit: 2000, spent: 0 },
  { category: "Bills & Utilities", limit: 4000, spent: 0 },
  { category: "Health & Medical", limit: 2000, spent: 0 },
  { category: "Travel", limit: 5000, spent: 0 },
  { category: "Education", limit: 3000, spent: 0 },
];

export const DEFAULT_GOALS: Goal[] = [
  {
    id: "goal_1",
    name: "Emergency Fund",
    targetAmount: 200000,
    currentAmount: 85000,
    deadline: "2025-12-31",
    icon: "🛡️",
  },
  {
    id: "goal_2",
    name: "New Laptop",
    targetAmount: 80000,
    currentAmount: 45000,
    deadline: "2025-06-30",
    icon: "💻",
  },
  {
    id: "goal_3",
    name: "Vacation Fund",
    targetAmount: 50000,
    currentAmount: 18000,
    deadline: "2025-08-31",
    icon: "✈️",
  },
  {
    id: "goal_4",
    name: "Investment Corpus",
    targetAmount: 500000,
    currentAmount: 120000,
    deadline: "2026-12-31",
    icon: "📈",
  },
];
