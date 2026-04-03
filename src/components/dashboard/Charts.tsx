"use client";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, Legend
} from "recharts";
import { motion } from "framer-motion";
import { useTransactionStore } from "@/store/useTransactionStore";
import { CATEGORY_COLORS } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#3b82f6", "#f97316"];

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl p-3 text-xs shadow-2xl min-w-[120px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-medium text-foreground">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function BalanceTrendChart() {
  const { getMonthlyData } = useTransactionStore();
  const data = getMonthlyData();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Balance Trend</CardTitle>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-violet-500 inline-block rounded" /> Balance</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" /> Income</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-rose-500 inline-block rounded" /> Expenses</span>
        </div>
      </CardHeader>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="h-52"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="balance" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="4 2" />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </Card>
  );
}

export function SpendingPieChart() {
  const { getCategorySpending } = useTransactionStore();
  const spendingData = getCategorySpending();

  const data = Object.entries(spendingData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Spending by Category</CardTitle></CardHeader>
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          No expense data
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Spending by Category</CardTitle></CardHeader>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="h-48"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="45%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => [formatCurrency(Number(v)), ""]}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                fontSize: 11,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
      <div className="mt-1 space-y-1">
        {data.slice(0, 4).map((d, i) => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-muted-foreground truncate max-w-[100px]">{d.name}</span>
            </div>
            <span className="font-medium text-foreground">
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function MonthlyBarChart() {
  const { getMonthlyData } = useTransactionStore();
  const data = getMonthlyData();

  return (
    <Card className="col-span-2 lg:col-span-1">
      <CardHeader><CardTitle>Monthly Comparison</CardTitle></CardHeader>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="h-52"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={20} name="income" />
            <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={20} name="expenses" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </Card>
  );
}
