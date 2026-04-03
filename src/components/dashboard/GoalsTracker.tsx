"use client";
import { motion } from "framer-motion";
import { useTransactionStore } from "@/store/useTransactionStore";
import { formatCurrency, calculatePercentage } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function GoalsTracker() {
  const { goals } = useTransactionStore();
  const now = Date.now();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goals</CardTitle>
        <span className="text-xs text-muted-foreground">{goals.length} active</span>
      </CardHeader>

      {goals.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
          No goals set
        </div>
      ) : (
        <div className="space-y-4">
          {goals.slice(0, 4).map((goal, i) => {
            const pct = calculatePercentage(goal.currentAmount, goal.targetAmount);
            const daysLeft = Math.max(
              0,
              Math.ceil((new Date(goal.deadline).getTime() - now) / 86400000)
            );

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, type: "spring" as const, stiffness: 280, damping: 24 }}
                whileHover={{ x: -3, transition: { duration: 0.16 } }}
                className="space-y-1.5 cursor-default"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{goal.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{goal.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-violet-400">{pct}%</span>
                    <p className="text-[10px] text-muted-foreground">{daysLeft}d left</p>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct, 100)}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      pct >= 100 ? "bg-emerald-500" : pct >= 60 ? "bg-violet-500" : "bg-amber-500"
                    )}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
