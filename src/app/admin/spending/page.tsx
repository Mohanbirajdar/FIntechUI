"use client";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useTransactionStore } from "@/store/useTransactionStore";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { AlertTriangle } from "lucide-react";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#ec4899", "#06b6d4", "#f97316"];

export default function SpendingAnalysisPage() {
  const { getCategorySpending, getMonthlyData, transactions, getTotalExpenses } = useTransactionStore();
  const spending = getCategorySpending();
  const total = getTotalExpenses();
  const monthly = getMonthlyData();
  const anomalous = transactions.filter((t) => t.isAnomalous);

  const catData = Object.entries(spending)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({
      name,
      value,
      pct: total > 0 ? Math.round((value / total) * 100) : 0,
      icon: CATEGORY_ICONS[name as keyof typeof CATEGORY_ICONS] || "💰",
      color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] || "#8b5cf6",
    }));

  const radarData = catData.slice(0, 6).map((d) => ({ subject: d.name.split(" ")[0], value: d.pct }));

  return (
    <AdminLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={fadeUp}>
          <h1 className="text-2xl font-bold text-foreground">Spending Analysis</h1>
          <p className="text-sm text-muted-foreground">Platform-wide spending patterns and category insights</p>
        </motion.div>

        {/* Summary */}
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Platform Expenses", value: formatCurrency(total), color: "text-rose-400" },
            { label: "Categories Active", value: Object.keys(spending).length, color: "text-violet-400" },
            { label: "Anomalous Transactions", value: anomalous.length, color: "text-amber-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border p-5 text-center" style={{ background: "var(--card)" }}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Category charts */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Category Distribution</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }}
                    formatter={(v) => [formatCurrency(Number(v)), "Amount"]} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}>
                    {catData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Spending Radar</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 50]} tick={{ fontSize: 8 }} />
                  <Radar name="Spending" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Monthly trends */}
        <motion.div variants={fadeUp}>
          <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Monthly Income vs Expenses</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} width={40} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }}
                    formatter={(v) => [formatCurrency(Number(v)), ""]} />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} name="Income" />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={28} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Anomalies */}
        <motion.div variants={fadeUp}>
          <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Anomaly Detection</h3>
              <span className="text-xs font-semibold px-2 py-1 rounded-full"
                style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
                <AlertTriangle className="inline w-3 h-3 mr-1" />
                {anomalous.length} flagged
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {anomalous.slice(0, 9).map((tx) => (
                <div key={tx.id} className="p-3 rounded-xl border flex items-center gap-3"
                  style={{ borderColor: "rgba(245,158,11,0.25)", background: "rgba(245,158,11,0.04)" }}>
                  <AlertTriangle size={14} style={{ color: "#f59e0b", flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{tx.notes || tx.category}</p>
                    <p className="text-[10px] text-muted-foreground">{tx.category} · {tx.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold" style={{ color: "#f59e0b" }}>{formatCurrency(tx.amount)}</p>
                    <p className="text-[10px] text-rose-400">{tx.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category breakdown table */}
        <motion.div variants={fadeUp}>
          <div className="rounded-2xl border border-border overflow-hidden" style={{ background: "var(--card)" }}>
            <div className="p-5 border-b border-border">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Category Deep Dive</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Category", "Transactions", "Total Amount", "% of Spend", "Avg/Transaction"].map((h) => (
                    <th key={h} className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {catData.map((d, i) => (
                  <tr key={d.name} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span>{d.icon}</span>
                        <span className="text-sm font-medium text-foreground">{d.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-foreground">
                      {transactions.filter((t) => t.category === d.name).length}
                    </td>
                    <td className="p-4 text-sm font-semibold text-foreground">{formatCurrency(d.value)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: d.color }} />
                        </div>
                        <span className="text-xs text-foreground font-medium">{d.pct}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatCurrency(Math.round(d.value / Math.max(transactions.filter((t) => t.category === d.name).length, 1)))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
