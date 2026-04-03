"use client";
import { motion } from "framer-motion";
import { useTransactionStore } from "@/store/useTransactionStore";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Lightbulb, TrendingDown, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface Insight {
  icon: React.ReactNode;
  color: string;
  bg: string;
  title: string;
  description: string;
}

export function SmartInsights() {
  const { getCategorySpending, getTotalIncome, getTotalExpenses, getMonthlyData } = useTransactionStore();

  const spending = getCategorySpending();
  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const monthly = getMonthlyData();
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  const topCategory = Object.entries(spending).sort(([, a], [, b]) => b - a)[0];
  const currMonth = monthly[monthly.length - 1];
  const prevMonth = monthly[monthly.length - 2];
  const monthlyExpenseChange = prevMonth && prevMonth.expenses
    ? ((currMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100
    : 0;

  const insights: Insight[] = [];

  if (topCategory) {
    insights.push({
      icon: <TrendingDown size={14} />,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      title: `Top Spend: ${topCategory[0]}`,
      description: `You spent ${formatCurrency(topCategory[1])} on ${topCategory[0]}. Consider reducing by 15% to save ${formatCurrency(topCategory[1] * 0.15)}.`,
    });
  }

  if (savingsRate > 25) {
    insights.push({
      icon: <CheckCircle size={14} />,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      title: "Great Savings Rate!",
      description: `You're saving ${savingsRate.toFixed(0)}% of your income. You're on track to meet your financial goals.`,
    });
  } else if (savingsRate < 10) {
    insights.push({
      icon: <AlertTriangle size={14} />,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      title: "Low Savings Alert",
      description: `Your savings rate is ${savingsRate.toFixed(0)}%. Aim for at least 20% by cutting discretionary expenses.`,
    });
  }

  if (monthlyExpenseChange > 10) {
    insights.push({
      icon: <TrendingUp size={14} />,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      title: "Spending Increased",
      description: `Your expenses rose ${monthlyExpenseChange.toFixed(0)}% vs last month. Review your recent transactions.`,
    });
  } else if (monthlyExpenseChange < -5) {
    insights.push({
      icon: <TrendingDown size={14} />,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      title: "Spending Reduced",
      description: `Great! Your expenses dropped ${Math.abs(monthlyExpenseChange).toFixed(0)}% vs last month.`,
    });
  }

  insights.push({
    icon: <Lightbulb size={14} />,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    title: "Smart Tip",
    description: "Automate your savings by setting up a recurring transfer on salary day — pay yourself first!",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Insights</CardTitle>
        <span className="text-xs px-2 py-0.5 bg-violet-500/15 text-violet-400 rounded-full">AI-Powered</span>
      </CardHeader>
      <div className="space-y-3">
        {insights.slice(0, 4).map((ins, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, type: "spring" as const, stiffness: 260, damping: 24 }}
            whileHover={{ x: 4, scale: 1.01, transition: { duration: 0.18 } }}
            className="flex gap-3 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors cursor-default"
          >
            <motion.div
              whileHover={{ rotate: 12, scale: 1.15 }}
              transition={{ type: "spring" as const, stiffness: 400, damping: 15 }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${ins.bg} ${ins.color}`}
            >
              {ins.icon}
            </motion.div>
            <div>
              <p className="text-xs font-semibold text-foreground">{ins.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{ins.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
