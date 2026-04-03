"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminStore } from "@/store/useAdminStore";
import { generateMonthlyUserGrowth } from "@/lib/adminMockData";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell
} from "recharts";
import { Users, TrendingUp, Activity, Award } from "lucide-react";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#3b82f6", "#ef4444"];

const retentionData = [
  { month: "Oct'24", d1: 85, d7: 62, d30: 41 },
  { month: "Nov'24", d1: 88, d7: 65, d30: 44 },
  { month: "Dec'24", d1: 82, d7: 59, d30: 38 },
  { month: "Jan'25", d1: 91, d7: 70, d30: 48 },
  { month: "Feb'25", d1: 87, d7: 67, d30: 46 },
  { month: "Mar'25", d1: 93, d7: 72, d30: 52 },
];

const dauMauData = [
  { month: "Oct'24", dau: 42, mau: 112 },
  { month: "Nov'24", dau: 48, mau: 128 },
  { month: "Dec'24", dau: 38, mau: 134 },
  { month: "Jan'25", dau: 55, mau: 145 },
  { month: "Feb'25", dau: 61, mau: 152 },
  { month: "Mar'25", dau: 67, mau: 160 },
];

export default function AnalyticsPage() {
  const { users } = useAdminStore();
  const [userGrowth] = useState(generateMonthlyUserGrowth);

  const topUsers = [...users].sort((a, b) => b.totalTransactions - a.totalTransactions).slice(0, 5);
  const avgSpend = users.length ? Math.round(users.reduce((s, u) => s + u.totalSpent, 0) / users.length) : 0;
  const avgTxns = users.length ? Math.round(users.reduce((s, u) => s + u.totalTransactions, 0) / users.length) : 0;

  const personalityData = [
    { name: "Savers", value: users.filter((u) => u.personality === "Saver").length },
    { name: "Balanced", value: users.filter((u) => u.personality === "Balanced").length },
    { name: "Spenders", value: users.filter((u) => u.personality === "Spender").length },
  ];

  return (
    <AdminLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={fadeUp}>
          <h1 className="text-2xl font-bold text-foreground">User Analytics</h1>
          <p className="text-sm text-muted-foreground">Platform-level user behaviour and engagement metrics</p>
        </motion.div>

        {/* KPIs */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Avg Spend/User", value: formatCurrency(avgSpend), icon: TrendingUp, color: "#8b5cf6" },
            { label: "Avg Transactions", value: avgTxns, icon: Activity, color: "#10b981" },
            { label: "DAU (today)", value: dauMauData[dauMauData.length - 1].dau, icon: Users, color: "#f59e0b" },
            { label: "Retention D30", value: `${retentionData[retentionData.length - 1].d30}%`, icon: Award, color: "#3b82f6" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{kpi.label}</span>
                <kpi.icon size={16} style={{ color: kpi.color }} />
              </div>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
            </div>
          ))}
        </motion.div>

        {/* DAU/MAU + Retention */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">DAU / MAU Ratio</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dauMauData}>
                  <defs>
                    <linearGradient id="gDAU" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gMAU" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }} />
                  <Area type="monotone" dataKey="mau" stroke="#10b981" strokeWidth={2} fill="url(#gMAU)" name="MAU" />
                  <Area type="monotone" dataKey="dau" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gDAU)" name="DAU" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Retention Rates (%)</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={retentionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={30} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }} />
                  <Line type="monotone" dataKey="d1" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Day 1" />
                  <Line type="monotone" dataKey="d7" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Day 7" />
                  <Line type="monotone" dataKey="d30" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Day 30" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Top users + Personality pie */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Top Users by Activity</h3>
            <div className="space-y-3">
              {topUsers.map((user, i) => (
                <div key={user.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/30 transition-colors">
                  <div className="text-sm font-bold text-muted-foreground w-5 text-center">#{i + 1}</div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: `hsl(${i * 50 + 250},70%,55%)` }}>
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{user.totalTransactions}</p>
                    <p className="text-xs text-muted-foreground">transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-violet-400">{formatCurrency(user.totalSpent)}</p>
                    <p className="text-xs text-muted-foreground">spent</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: user.personality === "Saver" ? "rgba(16,185,129,0.15)" : user.personality === "Balanced" ? "rgba(139,92,246,0.15)" : "rgba(245,158,11,0.15)",
                      color: user.personality === "Saver" ? "#10b981" : user.personality === "Balanced" ? "#8b5cf6" : "#f59e0b"
                    }}>
                    {user.personality}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Personality Split</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={personalityData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                    {personalityData.map((_, i) => (
                      <Cell key={i} fill={["#10b981", "#8b5cf6", "#f59e0b"][i]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {personalityData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: ["#10b981", "#8b5cf6", "#f59e0b"][i] }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
