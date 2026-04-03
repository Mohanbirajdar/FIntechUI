"use client";
import { motion } from "framer-motion";
import { useTransactionStore } from "@/store/useTransactionStore";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKS = 12;

function getIntensity(amount: number, max: number): number {
  if (!amount || max === 0) return 0;
  const ratio = amount / max;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

const intensityColors = {
  0: "bg-muted/30",
  1: "bg-violet-500/20",
  2: "bg-violet-500/45",
  3: "bg-violet-500/70",
  4: "bg-violet-500",
};

export function SpendingHeatmap() {
  const { transactions } = useTransactionStore();

  // Build daily spending map
  const dailySpend: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      dailySpend[t.date] = (dailySpend[t.date] || 0) + t.amount;
    });

  const maxSpend = Math.max(...Object.values(dailySpend), 1);

  // Build grid: 12 weeks x 7 days
  const today = new Date();
  const grid: { date: string; amount: number; intensity: number }[][] = [];

  for (let w = WEEKS - 1; w >= 0; w--) {
    const week: { date: string; amount: number; intensity: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (w * 7 + (6 - d)));
      const dateStr = date.toISOString().split("T")[0];
      const amount = dailySpend[dateStr] || 0;
      week.push({ date: dateStr, amount, intensity: getIntensity(amount, maxSpend) });
    }
    grid.push(week);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Heatmap</CardTitle>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={cn("w-3 h-3 rounded-sm", intensityColors[i as keyof typeof intensityColors])} />
          ))}
          <span>More</span>
        </div>
      </CardHeader>

      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1">
            <div className="h-3" /> {/* spacer for alignment */}
            {DAYS.map((d, i) => (
              <div key={d} className={cn("h-3 text-[9px] text-muted-foreground flex items-center", i % 2 === 0 ? "opacity-100" : "opacity-0")}>
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              <div className="h-3 text-[9px] text-muted-foreground text-center">
                {wi % 3 === 0 ? new Date(week[0].date).toLocaleString("en-IN", { month: "short" }) : ""}
              </div>
              {week.map((day, di) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.5, zIndex: 10 }}
                  transition={{ delay: (wi * 7 + di) * 0.002, type: "spring" as const, stiffness: 400, damping: 20 }}
                  title={day.amount > 0 ? `${day.date}: ₹${day.amount.toLocaleString("en-IN")}` : day.date}
                  className={cn(
                    "w-3 h-3 rounded-sm cursor-pointer hover:ring-1 hover:ring-violet-400 transition-colors",
                    intensityColors[day.intensity as keyof typeof intensityColors]
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
