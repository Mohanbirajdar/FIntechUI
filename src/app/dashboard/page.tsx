"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { BalanceTrendChart, SpendingPieChart, MonthlyBarChart } from "@/components/dashboard/Charts";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SmartInsights } from "@/components/dashboard/SmartInsights";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { SpendingHeatmap } from "@/components/dashboard/SpendingHeatmap";
import { GoalsTracker } from "@/components/dashboard/GoalsTracker";

const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { isOnboardingComplete, onboarding, theme, setTheme } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setTheme(theme);
    if (!isOnboardingComplete) {
      router.replace("/onboarding");
    }
  }, [isOnboardingComplete, router, theme, setTheme]);

  if (!isOnboardingComplete) return null;

  const greeting = onboarding.fullName
    ? `Hello, ${onboarding.fullName.split(" ")[0]} 👋`
    : "Welcome back 👋";

  return (
    <DashboardLayout>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={sectionVariants} className="pt-2">
          <h1 className="text-2xl font-bold text-foreground">{greeting}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={sectionVariants}>
          <SummaryCards />
        </motion.div>

        {/* Charts Row */}
        <motion.div variants={sectionVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <BalanceTrendChart />
            </div>
            <SpendingPieChart />
          </div>
        </motion.div>

        {/* Middle Row */}
        <motion.div variants={sectionVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <RecentTransactions />
            </div>
            <SmartInsights />
          </div>
        </motion.div>

        {/* Budget & Goals & Heatmap */}
        <motion.div variants={sectionVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BudgetProgress />
            <GoalsTracker />
            <div className="md:col-span-1">
              <MonthlyBarChart />
            </div>
          </div>
        </motion.div>

        {/* Heatmap */}
        <motion.div variants={sectionVariants}>
          <SpendingHeatmap />
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
