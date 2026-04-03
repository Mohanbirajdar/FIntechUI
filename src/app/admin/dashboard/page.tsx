"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminStore } from "@/store/useAdminStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import {
  generateMonthlyUserGrowth, generateTransactionTrends
} from "@/lib/adminMockData";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, AreaChart, Area
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import {
  Users, ArrowUpDown, TrendingUp, TrendingDown, Activity,
  AlertTriangle, Shield, Zap, ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function AdminDashboard() {
  const { users, initialize } = useAdminStore();
  const { transactions, getTotalIncome, getTotalExpenses } = useTransactionStore();
  const [userGrowth] = useState(generateMonthlyUserGrowth);
  const [txTrends] = useState(generateTransactionTrends);
  const [platformScore] = useState(() => Math.round(72 + Math.random() * 20));
  const [liveCount, setLiveCount] = useState(Math.round(users.length * 0.3));

  useEffect(() => { initialize(); }, [initialize]);

  // Real-time simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((c) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(1, Math.min(users.length, c + delta));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [users.length]);

  const activeUsers = users.filter((u) => u.status === "active").length;
  const anomalousCount = transactions.filter((t) => t.isAnomalous).length;
  const totalMoneyFlow = getTotalIncome() + getTotalExpenses();

  const kpis = [
    {
      label: "Total Users",
      value: users.length,
      sub: `${activeUsers} active`,
      icon: Users,
      grad: "from-violet-600 to-indigo-600",
      change: +12.4,
    },
    {
      label: "Total Transactions",
      value: transactions.length.toLocaleString(),
      sub: `${anomalousCount} anomalies`,
      icon: ArrowUpDown,
      grad: "from-amber-500 to-orange-500",
      change: +8.1,
    },
    {
      label: "Total Money Flow",
      value: formatCurrency(totalMoneyFlow),
      sub: "All time",
      icon: TrendingUp,
      grad: "from-emerald-500 to-teal-500",
      change: +15.3,
    },
    {
      label: "Live Users",
      value: liveCount,
      sub: "Right now",
      icon: Activity,
      grad: "from-rose-500 to-pink-500",
      change: 0,
      pulse: true,
    },
  ];

  const healthColor =
    platformScore >= 85 ? "#10b981" : platformScore >= 65 ? "#f59e0b" : "#ef4444";

  return (
    <AdminLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={fadeUp}>
          <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="relative overflow-hidden rounded-2xl p-5 border border-border"
              style={{ background: "var(--card)" }}
            >
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-15 bg-gradient-to-br ${kpi.grad}`} />
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{kpi.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${kpi.grad} shadow-lg`}>
                  <kpi.icon size={16} className="text-white" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                {kpi.pulse && (
                  <span className="mb-0.5 flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-emerald-500 font-medium">LIVE</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {kpi.change > 0 && <ArrowUpRight size={11} className="text-emerald-500" />}
                <span className={`text-xs font-medium ${kpi.change > 0 ? "text-emerald-500" : "text-muted-foreground"}`}>
                  {kpi.change > 0 ? `+${kpi.change}%` : kpi.sub}
                </span>
                {kpi.change > 0 && <span className="text-xs text-muted-foreground">{kpi.sub}</span>}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Charts row */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* User growth */}
          <div className="lg:col-span-2 rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">User Growth</h3>
                <p className="text-2xl font-bold text-foreground mt-0.5">{userGrowth[userGrowth.length - 1]?.users}</p>
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-violet-500 rounded-sm" />Total</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-sm" />Active</span>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowth}>
                  <defs>
                    <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }} />
                  <Area type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gUsers)" name="Total Users" />
                  <Area type="monotone" dataKey="active" stroke="#f59e0b" strokeWidth={2} fill="url(#gActive)" name="Active Users" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Health */}
          <div className="rounded-2xl border border-border p-5 flex flex-col" style={{ background: "var(--card)" }}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Platform Health</h3>
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              {/* Circular score */}
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--muted)" strokeWidth="10" />
                  <motion.circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={healthColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - platformScore / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">{platformScore}</span>
                  <span className="text-[10px] text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div className="space-y-2 w-full">
                {[
                  { label: "Uptime", value: "99.8%", ok: true },
                  { label: "Error Rate", value: "0.12%", ok: true },
                  { label: "Avg Response", value: "142ms", ok: true },
                  { label: "Anomalies", value: `${anomalousCount} txns`, ok: anomalousCount < 10 },
                ].map((m) => (
                  <div key={m.label} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className={m.ok ? "text-emerald-500 font-medium" : "text-rose-400 font-medium"}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transaction trends + Personality dist */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Transaction Volume Trends</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={txTrends} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }} />
                  <Bar dataKey="volume" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={24} name="Transactions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Personality Distribution */}
          <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">User Personalities</h3>
            {(["Saver", "Balanced", "Spender"] as const).map((p) => {
              const count = users.filter((u) => u.personality === p).length;
              const pct = users.length ? Math.round((count / users.length) * 100) : 0;
              const color = p === "Saver" ? "#10b981" : p === "Balanced" ? "#8b5cf6" : "#f59e0b";
              const emoji = p === "Saver" ? "🏆" : p === "Balanced" ? "⚖️" : "💸";
              return (
                <div key={p} className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <span>{emoji}</span> {p}
                    </span>
                    <span className="text-muted-foreground">{count} users ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: color }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Top user */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Top User by Activity</p>
              {users.sort((a, b) => b.totalTransactions - a.totalTransactions).slice(0, 1).map((u) => (
                <div key={u.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                    {u.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground">{u.totalTransactions} transactions</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 font-semibold">
                      #{u.personality}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent anomalies */}
        <motion.div variants={fadeUp}>
          <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Recent Anomalies</h3>
              <div className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full"
                style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
                <AlertTriangle size={11} /> {transactions.filter((t) => t.isAnomalous).length} flagged
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {transactions.filter((t) => t.isAnomalous).slice(0, 6).map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl border"
                  style={{ background: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.2)" }}>
                  <AlertTriangle size={14} style={{ color: "#f59e0b", flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{tx.notes || tx.category}</p>
                    <p className="text-[10px] text-muted-foreground">{tx.date} · {tx.category}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-400">{formatCurrency(tx.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
