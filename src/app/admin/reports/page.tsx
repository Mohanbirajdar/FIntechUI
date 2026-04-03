"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useAdminStore } from "@/store/useAdminStore";
import { formatCurrency, downloadCSV, downloadJSON } from "@/lib/utils";
import { FileText, Download, TrendingUp, TrendingDown, Users, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function ReportsPage() {
  const { transactions, getMonthlyData, getTotalIncome, getTotalExpenses } = useTransactionStore();
  const { users } = useAdminStore();
  const [generating, setGenerating] = useState(false);
  const monthly = getMonthlyData();
  const income = getTotalIncome();
  const expenses = getTotalExpenses();

  const generateReport = async (type: string) => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1200));
    setGenerating(false);

    if (type === "csv") {
      downloadCSV(
        transactions.map((t) => ({ date: t.date, amount: t.amount, category: t.category, type: t.type, notes: t.notes })) as Record<string, unknown>[],
        `fintrack_report_${new Date().toISOString().split("T")[0]}.csv`
      );
    } else if (type === "json") {
      downloadJSON({ transactions, monthly, summary: { income, expenses, balance: income - expenses, users: users.length } },
        `fintrack_report_${new Date().toISOString().split("T")[0]}.json`
      );
    } else {
      // Simulate PDF generation
      toast.success("Monthly report generated! (PDF simulation)");
      return;
    }
    toast.success("Report exported successfully!");
  };

  const anomalous = transactions.filter((t) => t.isAnomalous);
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  return (
    <AdminLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={fadeUp}>
          <h1 className="text-2xl font-bold text-foreground">Reports & Export</h1>
          <p className="text-sm text-muted-foreground">Generate and download platform reports</p>
        </motion.div>

        {/* Quick stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Income", value: formatCurrency(income), icon: TrendingUp, color: "#10b981" },
            { label: "Total Expenses", value: formatCurrency(expenses), icon: TrendingDown, color: "#ef4444" },
            { label: "Platform Users", value: users.length, icon: Users, color: "#8b5cf6" },
            { label: "Total Transactions", value: transactions.length, icon: ArrowUpDown, color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
              <s.icon size={18} style={{ color: s.color }} className="mb-2" />
              <div className="text-xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Export Options */}
        <motion.div variants={fadeUp}>
          <div className="rounded-2xl border border-border p-6" style={{ background: "var(--card)" }}>
            <h3 className="text-base font-semibold text-foreground mb-5">Export Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "CSV Export",
                  desc: "Export all transactions as comma-separated values. Compatible with Excel.",
                  icon: "📊",
                  type: "csv",
                  color: "from-emerald-500 to-teal-500",
                },
                {
                  title: "JSON Export",
                  desc: "Full platform data export including user summaries and monthly trends.",
                  icon: "🗂️",
                  type: "json",
                  color: "from-violet-500 to-indigo-500",
                },
                {
                  title: "Monthly Report",
                  desc: "Generate a comprehensive monthly report with insights and recommendations.",
                  icon: "📋",
                  type: "pdf",
                  color: "from-amber-500 to-orange-500",
                },
              ].map((opt) => (
                <div key={opt.type} className="rounded-2xl border border-border p-5 hover:border-violet-500/30 transition-colors"
                  style={{ background: "var(--accent)" }}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 bg-gradient-to-br ${opt.color}`}>
                    {opt.icon}
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{opt.title}</h4>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{opt.desc}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    loading={generating}
                    onClick={() => generateReport(opt.type)}
                    className="w-full"
                  >
                    <Download size={12} /> Generate & Export
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Monthly summary chart */}
        <motion.div variants={fadeUp}>
          <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Monthly Summary Report</h3>
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
                  <Bar dataKey="balance" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={28} name="Balance" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Anomaly report */}
        <motion.div variants={fadeUp}>
          <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Anomaly Report</h3>
              <Button variant="outline" size="sm" onClick={() => { downloadCSV(anomalous.map((t) => ({ date: t.date, amount: t.amount, category: t.category, notes: t.notes })) as Record<string, unknown>[], "anomalies.csv"); toast.success("Exported"); }}>
                <Download size={12} /> Export Anomalies
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 rounded-xl" style={{ background: "rgba(245,158,11,0.08)" }}>
                <p className="text-2xl font-bold" style={{ color: "#f59e0b" }}>{anomalous.length}</p>
                <p className="text-xs text-muted-foreground">Total Anomalies</p>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.08)" }}>
                <p className="text-2xl font-bold text-rose-400">{formatCurrency(anomalous.reduce((s, t) => s + t.amount, 0))}</p>
                <p className="text-xs text-muted-foreground">Total Value</p>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: "rgba(139,92,246,0.08)" }}>
                <p className="text-2xl font-bold text-violet-400">{transactions.length > 0 ? ((anomalous.length / transactions.length) * 100).toFixed(1) : 0}%</p>
                <p className="text-xs text-muted-foreground">Anomaly Rate</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={fadeUp}>
          <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">AI-Generated Platform Insights</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(139,92,246,0.15)", color: "#8b5cf6" }}>AI</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  title: "Platform Savings Rate",
                  body: `Overall platform savings rate is ${savingsRate.toFixed(0)}%. ${savingsRate > 20 ? "Users are performing well!" : "Consider targeted savings campaigns."}`,
                  icon: "📈",
                  color: savingsRate > 20 ? "#10b981" : "#f59e0b",
                },
                {
                  title: "User Retention Opportunity",
                  body: `${users.filter((u) => u.status === "inactive").length} inactive users detected. A re-engagement campaign could boost MAU by 15%.`,
                  icon: "🎯",
                  color: "#8b5cf6",
                },
                {
                  title: "Anomaly Monitoring",
                  body: `${anomalous.length} transactions flagged as unusual. Review flagged transactions to maintain platform integrity.`,
                  icon: "🔍",
                  color: "#f59e0b",
                },
                {
                  title: "Growth Forecast",
                  body: `Based on current trends, user base expected to grow 18-22% next quarter. Focus on retention to maximize LTV.`,
                  icon: "🚀",
                  color: "#3b82f6",
                },
              ].map((insight) => (
                <div key={insight.title} className="p-4 rounded-xl border border-border hover:border-violet-500/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0" style={{ background: `${insight.color}20` }}>
                      {insight.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{insight.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{insight.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
