"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SpendingPersonality } from "@/components/insights/SpendingPersonality";
import { CategoryBreakdown } from "@/components/insights/CategoryBreakdown";
import { SmartRecommendations } from "@/components/insights/SmartRecommendations";
import { BalanceTrendChart, MonthlyBarChart } from "@/components/dashboard/Charts";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

export default function InsightsPage() {
  const { isOnboardingComplete, theme, setTheme } = useAppStore();
  const { transactions, getTotalIncome, getTotalExpenses, getMonthlyData } = useTransactionStore();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setTheme(theme);
    if (!isOnboardingComplete) router.replace("/onboarding");
  }, [isOnboardingComplete, router, theme, setTheme]);

  if (!isOnboardingComplete) return null;

  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const monthly = getMonthlyData();
  const anomalous = transactions.filter((t) => t.isAnomalous);
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  const pageVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <DashboardLayout>
      <motion.div variants={pageVariants} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="pt-2">
          <h1 className="text-2xl font-bold text-foreground">Financial Insights</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Deep analysis of your spending behavior</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Savings Rate", value: `${savingsRate.toFixed(0)}%`, icon: TrendingUp, color: savingsRate > 20 ? "text-emerald-500" : "text-amber-500", sub: savingsRate > 20 ? "Excellent!" : "Needs work" },
              { label: "Avg Monthly Exp", value: formatCurrency(expenses / Math.max(monthly.length, 1)), icon: TrendingDown, color: "text-rose-400", sub: "Per month" },
              { label: "Anomalous Txns", value: String(anomalous.length), icon: AlertTriangle, color: "text-amber-400", sub: "Unusual amounts" },
              { label: "Total Txns", value: String(transactions.length), icon: TrendingUp, color: "text-violet-400", sub: "All time" },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                className="glass-card rounded-2xl p-4 text-center"
              >
                <m.icon size={20} className={`mx-auto mb-2 ${m.color}`} />
                <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
                <div className="text-[10px] text-muted-foreground">{m.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2"><BalanceTrendChart /></div>
            <SpendingPersonality />
          </div>
        </motion.div>

        {/* Breakdown + Recommendations */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategoryBreakdown />
            <SmartRecommendations />
          </div>
        </motion.div>

        {/* Monthly bar + Anomalies */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2"><MonthlyBarChart /></div>
            <Card>
              <CardHeader>
                <CardTitle>Anomaly Alerts</CardTitle>
                <span className="text-xs bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {anomalous.length} flagged
                </span>
              </CardHeader>
              {anomalous.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  <span className="text-2xl block mb-1">✅</span>
                  No anomalies detected
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                  {anomalous.slice(0, 8).map((tx) => (
                    <div key={tx.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{tx.notes || tx.category}</p>
                        <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                      </div>
                      <span className="text-xs font-bold text-amber-400">{formatCurrency(tx.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
