"use client";
import { motion, type Variants } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useAnimatedCounter } from "@/lib/useAnimatedCounter";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  show:   { opacity: 1, y: 0,  scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
};

interface CardConfig {
  label: string;
  rawValue: number;
  display: string;
  icon: React.ElementType;
  bg: string;
  glow: string;
  trend: number;
  trendLabel: string;
}

function AnimatedCard({ card, index }: { card: CardConfig; index: number }) {
  const count = useAnimatedCounter(card.rawValue, 1100, index * 100);

  // Re-format the animated count in INR if the card is currency-based
  const isCurrency = !card.display.endsWith("%");
  const displayValue = isCurrency
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(count)
    : `${count}%`;

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5, transition: { duration: 0.22 } }}
      className="rounded-2xl p-5 relative overflow-hidden cursor-default group"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      {/* Animated gradient blob */}
      <motion.div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${card.bg}`}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Shimmer line on hover */}
      <motion.div
        className="absolute inset-x-0 top-0 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.8), transparent)" }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            {card.label}
          </span>
          <motion.div
            whileHover={{ rotate: 12, scale: 1.15 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${card.bg} ${card.glow}`}
          >
            <card.icon size={18} className="text-white" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="text-2xl font-bold text-foreground tabular-nums"
        >
          {displayValue}
        </motion.div>

        <div className="flex items-center gap-1 mt-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
          >
            {card.trend > 0
              ? <ArrowUpRight size={12} className="text-emerald-500" />
              : <ArrowDownRight size={12} className="text-rose-500" />}
          </motion.div>
          <span className={`text-xs font-semibold ${card.trend > 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {Math.abs(card.trend).toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">{card.trendLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function SummaryCards() {
  const { getTotalIncome, getTotalExpenses, getBalance, getMonthlyData } = useTransactionStore();

  const income   = getTotalIncome();
  const expenses = getTotalExpenses();
  const balance  = getBalance();
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  const monthly = getMonthlyData();
  const prev    = monthly[monthly.length - 2];
  const curr    = monthly[monthly.length - 1];
  const monthlyChange = prev
    ? ((curr.balance - prev.balance) / (Math.abs(prev.balance) || 1)) * 100
    : 0;

  const cards: CardConfig[] = [
    {
      label: "Total Balance",
      rawValue: balance,
      display: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(balance),
      icon: Wallet,
      bg: "bg-gradient-to-br from-violet-600 to-indigo-600",
      glow: "shadow-violet-500/30",
      trend: monthlyChange,
      trendLabel: "vs last month",
    },
    {
      label: "Total Income",
      rawValue: income,
      display: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(income),
      icon: TrendingUp,
      bg: "bg-gradient-to-br from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/30",
      trend: 8.2,
      trendLabel: "this month",
    },
    {
      label: "Total Expenses",
      rawValue: expenses,
      display: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(expenses),
      icon: TrendingDown,
      bg: "bg-gradient-to-br from-rose-500 to-pink-500",
      glow: "shadow-rose-500/30",
      trend: -3.1,
      trendLabel: "this month",
    },
    {
      label: "Savings Rate",
      rawValue: savingsRate,
      display: `${savingsRate}%`,
      icon: PiggyBank,
      bg: "bg-gradient-to-br from-amber-500 to-orange-500",
      glow: "shadow-amber-500/30",
      trend: savingsRate > 20 ? 5 : -2,
      trendLabel: "vs avg",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card, i) => (
        <AnimatedCard key={card.label} card={card} index={i} />
      ))}
    </motion.div>
  );
}
