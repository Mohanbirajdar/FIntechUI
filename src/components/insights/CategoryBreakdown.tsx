"use client";
import { motion } from "framer-motion";
import { useTransactionStore } from "@/store/useTransactionStore";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/types";
import { formatCurrency, calculatePercentage } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function CategoryBreakdown() {
  const { getCategorySpending, getTotalExpenses } = useTransactionStore();
  const spending = getCategorySpending();
  const total = getTotalExpenses();

  const sorted = Object.entries(spending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  if (!sorted.length) {
    return (
      <Card>
        <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
        <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
          No expense data available
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <span className="text-xs text-muted-foreground">Total: {formatCurrency(total)}</span>
      </CardHeader>
      <div className="space-y-3">
        {sorted.map(([cat, amt], i) => {
          const pct = calculatePercentage(amt, total);
          const color = CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] || "#8b5cf6";
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, type: "spring" as const, stiffness: 280, damping: 24 }}
              whileHover={{ x: 4, transition: { duration: 0.16 } }}
              className="space-y-1.5 cursor-default"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS] || "💰"}</span>
                  <span className="font-medium text-foreground">{cat}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{pct}%</span>
                  <span className="font-semibold text-foreground">{formatCurrency(amt)}</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
