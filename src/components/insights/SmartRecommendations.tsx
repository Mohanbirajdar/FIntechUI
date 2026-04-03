"use client";
import { motion } from "framer-motion";
import { useTransactionStore } from "@/store/useTransactionStore";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Zap, Target, TrendingDown, Star } from "lucide-react";

export function SmartRecommendations() {
  const { getCategorySpending, getTotalIncome, getTotalExpenses, getMonthlyData } = useTransactionStore();

  const spending = getCategorySpending();
  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const monthly = getMonthlyData();

  const sorted = Object.entries(spending).sort(([, a], [, b]) => b - a);
  const topSpend = sorted[0];
  const secondSpend = sorted[1];

  const recs: { icon: React.ReactNode; color: string; bg: string; title: string; action: string; impact: string }[] = [];

  if (topSpend) {
    const reduction = topSpend[1] * 0.15;
    recs.push({
      icon: <TrendingDown size={14} />,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      title: `Reduce ${topSpend[0]} by 15%`,
      action: `Cut your top spending category by 15% to save ${formatCurrency(reduction)}/month`,
      impact: `+${formatCurrency(reduction * 12)}/year`,
    });
  }

  if (savingsRate < 20) {
    const targetSave = income * 0.2 - (income - expenses);
    recs.push({
      icon: <Target size={14} />,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      title: "Reach 20% Savings Rate",
      action: `Save ${formatCurrency(Math.max(0, targetSave))} more per month to hit the 20% savings target`,
      impact: `${(20 - savingsRate).toFixed(0)}% improvement needed`,
    });
  }

  if (secondSpend) {
    recs.push({
      icon: <Zap size={14} />,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      title: `Optimize ${secondSpend[0]}`,
      action: `You spend ${formatCurrency(secondSpend[1])} on ${secondSpend[0]}. Look for deals or alternatives`,
      impact: `Potential 10% savings`,
    });
  }

  const prevMonth = monthly[monthly.length - 2];
  const currMonth = monthly[monthly.length - 1];
  if (prevMonth && currMonth.expenses > prevMonth.expenses) {
    recs.push({
      icon: <Star size={14} />,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      title: "Return to Last Month's Level",
      action: `Your expenses increased by ${formatCurrency(currMonth.expenses - prevMonth.expenses)} vs last month`,
      impact: `Save ${formatCurrency(currMonth.expenses - prevMonth.expenses)}/month`,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Recommendations</CardTitle>
        <span className="text-xs px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full">
          {recs.length} tips
        </span>
      </CardHeader>
      <div className="space-y-3">
        {recs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <span className="text-3xl block mb-2">🎉</span>
            Great job! No urgent recommendations.
          </div>
        ) : (
          recs.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring" as const, stiffness: 280, damping: 24 }}
              whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.18 } }}
              className="p-3.5 rounded-xl border border-border hover:border-violet-500/30 transition-colors bg-card cursor-default"
            >
              <div className="flex gap-3">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.15 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 15 }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${rec.bg} ${rec.color}`}
                >
                  {rec.icon}
                </motion.div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{rec.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{rec.action}</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    💚 {rec.impact}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
