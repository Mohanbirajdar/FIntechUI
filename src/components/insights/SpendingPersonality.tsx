"use client";
import { motion } from "framer-motion";
import { useTransactionStore } from "@/store/useTransactionStore";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function SpendingPersonality() {
  const { getTotalIncome, getTotalExpenses } = useTransactionStore();
  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  let type: "Saver" | "Balanced" | "Spender";
  let emoji: string;
  let color: string;
  let description: string;
  let traits: string[];

  if (savingsRate >= 30) {
    type = "Saver";
    emoji = "🏆";
    color = "from-emerald-500 to-teal-500";
    description = "You excel at saving money! You consistently set aside a large portion of your income.";
    traits = ["High savings rate", "Disciplined spending", "Future-focused", "Financial security"];
  } else if (savingsRate >= 15) {
    type = "Balanced";
    emoji = "⚖️";
    color = "from-violet-500 to-indigo-500";
    description = "You strike a good balance between enjoying life and saving for the future.";
    traits = ["Moderate savings", "Controlled spending", "Good financial habits", "Room to improve"];
  } else {
    type = "Spender";
    emoji = "💸";
    color = "from-amber-500 to-rose-500";
    description = "You tend to spend most of your income. Consider building an emergency fund first.";
    traits = ["Low savings rate", "High discretionary spend", "Lives in the moment", "Needs budget control"];
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Personality</CardTitle>
      </CardHeader>
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center text-4xl shadow-xl`}
        >
          {emoji}
        </motion.div>
        <div>
          <h3 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${color}`}>
            {type}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-xs">
            {description}
          </p>
        </div>
        <div className="w-full">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Spender</span>
            <span>Saver</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-violet-500 to-emerald-500 opacity-30" />
            <motion.div
              initial={{ left: "0%" }}
              animate={{ left: `${Math.min(Math.max(savingsRate, 5), 95)}%` }}
              transition={{ duration: 1, type: "spring" }}
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-violet-500 shadow-lg"
              style={{ transform: "translateX(-50%) translateY(-50%)" }}
            />
          </div>
          <p className="text-xs text-center text-muted-foreground mt-1">
            Savings rate: <span className="font-bold text-foreground">{savingsRate.toFixed(0)}%</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full mt-1">
          {traits.map((t) => (
            <div key={t} className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 text-center">
              {t}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
