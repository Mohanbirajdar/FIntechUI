"use client";
import { motion } from "framer-motion";
import { useTransactionStore } from "@/store/useTransactionStore";
import { CATEGORY_ICONS } from "@/types";
import { formatCurrency, calculatePercentage } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function BudgetProgress() {
  const { getCurrentMonthBudgetUsage } = useTransactionStore();
  const budgets = getCurrentMonthBudgetUsage().filter((b) => b.limit > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Tracker</CardTitle>
        <span className="text-xs text-muted-foreground">This month</span>
      </CardHeader>

      {budgets.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
          No budgets set
        </div>
      ) : (
        <div className="space-y-4">
          {budgets.slice(0, 5).map((b, i) => {
            const pct = calculatePercentage(b.spent, b.limit);
            const isOver = pct > 100;
            const isWarning = pct > 75;

            return (
              <motion.div
                key={b.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: "spring" as const, stiffness: 280, damping: 24 }}
                whileHover={{ x: 3, transition: { duration: 0.16 } }}
                className="space-y-1.5 cursor-default"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span>{CATEGORY_ICONS[b.category]}</span>
                    <span className="font-medium text-foreground truncate max-w-[100px]">{b.category}</span>
                    {isOver && <AlertTriangle size={10} className="text-rose-400" />}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span className={cn("font-semibold", isOver ? "text-rose-400" : isWarning ? "text-amber-400" : "text-foreground")}>
                      {formatCurrency(b.spent)}
                    </span>
                    <span>/</span>
                    <span>{formatCurrency(b.limit)}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct, 100)}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      isOver ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-violet-500"
                    )}
                  />
                </div>
                <div className="text-right">
                  <span className={cn("text-[10px] font-medium", isOver ? "text-rose-400" : "text-muted-foreground")}>
                    {isOver ? `${pct - 100}% over budget!` : `${100 - pct}% remaining`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
