"use client";
import { motion } from "framer-motion";
import { useTransactionStore } from "@/store/useTransactionStore";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/types";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function RecentTransactions() {
  const { transactions } = useTransactionStore();
  const router = useRouter();
  const recent = transactions.slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <button
          onClick={() => router.push("/transactions")}
          className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight size={12} />
        </button>
      </CardHeader>

      {recent.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center text-muted-foreground">
          <span className="text-4xl mb-2">💳</span>
          <span className="text-sm">No transactions yet</span>
        </div>
      ) : (
        <div className="space-y-1">
          {recent.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.055, type: "spring" as const, stiffness: 280, damping: 24 }}
              whileHover={{ x: 5, transition: { duration: 0.18 } }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/50 transition-all duration-200 group cursor-default"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                style={{ background: `${CATEGORY_COLORS[tx.category]}20` }}
              >
                {CATEGORY_ICONS[tx.category]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {tx.notes || tx.category}
                  </p>
                  {tx.isAnomalous && (
                    <span className="text-amber-400 text-xs">⚠️</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {tx.category} · {formatDateShort(tx.date)}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className={`text-sm font-bold ${tx.type === "income" ? "text-emerald-500" : "text-rose-400"}`}>
                  {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}
