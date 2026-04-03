import { Category, CATEGORY_COLORS } from "@/types";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
  lastActive: string;
  monthlyIncome: number;
  totalSpent: number;
  totalTransactions: number;
  status: "active" | "inactive" | "suspended";
  personality: "Saver" | "Spender" | "Balanced";
  savingsRate: number;
  tags: string[];
}

export interface MockCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  transactionCount: number;
  totalAmount: number;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  sentAt: string;
  readCount: number;
  totalUsers: number;
}

const names = [
  "Arjun Sharma", "Priya Patel", "Rahul Verma", "Anjali Singh", "Vikram Nair",
  "Neha Gupta", "Aditya Kumar", "Sneha Reddy", "Ravi Mehta", "Pooja Iyer",
  "Karan Malhotra", "Divya Krishnan", "Sanjay Bose", "Meera Shah", "Rohit Joshi",
  "Kavya Pillai", "Aakash Tiwari", "Shreya Agarwal", "Nikhil Desai", "Anita Rao"
];

const personalities: ("Saver" | "Spender" | "Balanced")[] = ["Saver", "Spender", "Balanced"];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - randomBetween(0, daysAgo));
  return d.toISOString().split("T")[0];
}

export function generateMockUsers(): MockUser[] {
  return names.map((name, i) => {
    const income = randomBetween(30000, 150000);
    const spentRatio = Math.random() * 0.9 + 0.1;
    const totalSpent = Math.round(income * spentRatio * 6);
    const savingsRate = Math.round((1 - spentRatio) * 100);
    const personality = savingsRate > 30 ? "Saver" : savingsRate < 10 ? "Spender" : "Balanced";

    const tagPool = ["High Value", "New User", "At Risk", "Loyal", "Power User", "Inactive"];
    const tags = savingsRate > 25 ? ["High Value", "Loyal"] :
                 savingsRate < 5 ? ["At Risk", "Spender"] :
                 i < 5 ? ["New User"] : ["Loyal"];

    return {
      id: `user_${i + 1}`,
      name,
      email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      avatar: name[0].toUpperCase(),
      joinedAt: randomDate(365),
      lastActive: randomDate(30),
      monthlyIncome: income,
      totalSpent,
      totalTransactions: randomBetween(20, 200),
      status: i === 3 ? "suspended" : i === 7 ? "inactive" : "active",
      personality,
      savingsRate,
      tags,
    };
  });
}

export function generateMockCategories(): MockCategory[] {
  const cats: { name: Category; icon: string }[] = [
    { name: "Food & Dining", icon: "🍕" },
    { name: "Transportation", icon: "🚗" },
    { name: "Shopping", icon: "🛍️" },
    { name: "Entertainment", icon: "🎬" },
    { name: "Bills & Utilities", icon: "⚡" },
    { name: "Health & Medical", icon: "🏥" },
    { name: "Travel", icon: "✈️" },
    { name: "Education", icon: "📚" },
    { name: "Salary", icon: "💼" },
    { name: "Freelance", icon: "💻" },
    { name: "Investment", icon: "📈" },
    { name: "Other", icon: "💰" },
  ];

  return cats.map((c, i) => ({
    id: `cat_${i + 1}`,
    name: c.name,
    icon: c.icon,
    color: CATEGORY_COLORS[c.name] || "#8b5cf6",
    transactionCount: randomBetween(50, 500),
    totalAmount: randomBetween(50000, 500000),
  }));
}

export function generateMonthlyUserGrowth(): { month: string; users: number; active: number }[] {
  const months = ["Oct'24", "Nov'24", "Dec'24", "Jan'25", "Feb'25", "Mar'25"];
  let base = 120;
  return months.map((month) => {
    base += randomBetween(8, 25);
    return { month, users: base, active: Math.round(base * (0.6 + Math.random() * 0.3)) };
  });
}

export function generateTransactionTrends(): { month: string; volume: number; amount: number }[] {
  const months = ["Oct'24", "Nov'24", "Dec'24", "Jan'25", "Feb'25", "Mar'25"];
  return months.map((month) => ({
    month,
    volume: randomBetween(800, 2000),
    amount: randomBetween(2000000, 8000000),
  }));
}

export const DEFAULT_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "notif_1",
    title: "System Maintenance",
    message: "Scheduled maintenance on Sunday 2 AM - 4 AM. Please save your work.",
    type: "warning",
    sentAt: new Date(Date.now() - 86400000).toISOString(),
    readCount: 142,
    totalUsers: 200,
  },
  {
    id: "notif_2",
    title: "New Feature: Voice Input",
    message: "Try our new voice-based transaction entry feature on the Transactions page!",
    type: "info",
    sentAt: new Date(Date.now() - 172800000).toISOString(),
    readCount: 89,
    totalUsers: 200,
  },
  {
    id: "notif_3",
    title: "Budget Milestone",
    message: "Congratulations! Platform users have collectively saved ₹1 Crore this month.",
    type: "success",
    sentAt: new Date(Date.now() - 259200000).toISOString(),
    readCount: 180,
    totalUsers: 200,
  },
];
