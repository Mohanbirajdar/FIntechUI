"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, calculatePercentage } from "@/lib/utils";
import { EXPENSE_CATEGORIES, Category, CATEGORY_ICONS } from "@/types";
import { toast } from "sonner";
import {
  User, Sun, Moon, Trash2, Target,
  Edit2, LogOut, Wallet, TrendingUp, CreditCard, Plus, Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { isOnboardingComplete, onboarding, role, theme, toggleTheme, resetOnboarding, updateOnboarding, setTheme } = useAppStore();
  const { goals, addGoal, updateGoal, deleteGoal, budgets, updateBudget, getTotalIncome, getTotalExpenses, transactions } = useTransactionStore();
  const router = useRouter();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editGoal, setEditGoal] = useState<typeof goals[0] | null>(null);
  const [goalForm, setGoalForm] = useState({ name: "", targetAmount: "", currentAmount: "", deadline: "", icon: "🎯" });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setTheme(theme);
    if (!isOnboardingComplete) router.replace("/onboarding");
  }, [isOnboardingComplete, router, theme, setTheme]);

  if (!isOnboardingComplete) return null;

  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  const handleAddGoal = () => {
    if (!goalForm.name || !goalForm.targetAmount) {
      toast.error("Please fill required fields");
      return;
    }
    if (editGoal) {
      updateGoal(editGoal.id, {
        name: goalForm.name,
        targetAmount: Number(goalForm.targetAmount),
        currentAmount: Number(goalForm.currentAmount),
        deadline: goalForm.deadline,
        icon: goalForm.icon,
      });
      toast.success("Goal updated!");
    } else {
      addGoal({
        name: goalForm.name,
        targetAmount: Number(goalForm.targetAmount),
        currentAmount: Number(goalForm.currentAmount),
        deadline: goalForm.deadline,
        icon: goalForm.icon,
      });
      toast.success("Goal added!");
    }
    setShowGoalModal(false);
    setGoalForm({ name: "", targetAmount: "", currentAmount: "", deadline: "", icon: "🎯" });
    setEditGoal(null);
  };

  const openEditGoal = (g: typeof goals[0]) => {
    setEditGoal(g);
    setGoalForm({
      name: g.name,
      targetAmount: String(g.targetAmount),
      currentAmount: String(g.currentAmount),
      deadline: g.deadline,
      icon: g.icon,
    });
    setShowGoalModal(true);
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <DashboardLayout>
      <motion.div variants={pageVariants} initial="hidden" animate="show" className="space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="pt-2">
          <h1 className="text-2xl font-bold text-foreground">Profile & Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
        </motion.div>

        {/* User Card */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5" />
            <div className="relative z-10 flex items-center gap-5">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center text-2xl shadow-xl shrink-0">
                {onboarding.fullName ? onboarding.fullName[0].toUpperCase() : "U"}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{onboarding.fullName || "Demo User"}</h2>
                <p className="text-sm text-muted-foreground">{onboarding.email || "demo@fintrack.app"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={role === "admin" ? "warning" : "purple"}>
                    {role === "admin" ? "👑 Admin" : "👤 User"}
                  </Badge>
                  {onboarding.phone && <Badge variant="info">📱 {onboarding.phone}</Badge>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Savings Rate</p>
                <p className="text-2xl font-bold text-violet-400">{savingsRate.toFixed(0)}%</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-border">
              {[
                { label: "Total Income", value: formatCurrency(income), icon: TrendingUp, color: "text-emerald-500" },
                { label: "Total Expenses", value: formatCurrency(expenses), icon: CreditCard, color: "text-rose-400" },
                { label: "Transactions", value: String(transactions.length), icon: Wallet, color: "text-violet-400" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <s.icon size={16} className={`mx-auto mb-1 ${s.color}`} />
                  <div className="text-sm font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
            <div className="space-y-3">
              {/* Theme */}
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? <Moon size={18} className="text-violet-400" /> : <Sun size={18} className="text-amber-400" />}
                  <div>
                    <p className="text-sm font-medium text-foreground">{theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
                    <p className="text-xs text-muted-foreground">Toggle between dark and light theme</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    theme === "dark" ? "bg-violet-500" : "bg-muted"
                  )}
                >
                  <motion.div
                    layout
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                    animate={{ left: theme === "dark" ? "calc(100% - 20px - 2px)" : "2px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

            </div>
          </Card>
        </motion.div>

        {/* Budget Management */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Budget Limits</CardTitle>
              <span className="text-xs text-muted-foreground">Monthly</span>
            </CardHeader>
            <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
              {budgets.map((b) => (
                <div key={b.category} className="flex items-center gap-3 py-1">
                  <span className="text-base w-7">{CATEGORY_ICONS[b.category]}</span>
                  <span className="text-sm text-foreground flex-1 truncate">{b.category}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateBudget(b.category, Math.max(0, b.limit - 500))}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold text-foreground w-20 text-center">
                      {formatCurrency(b.limit)}
                    </span>
                    <button
                      onClick={() => updateBudget(b.category, b.limit + 500)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Goals Management */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Financial Goals</CardTitle>
              <Button size="sm" onClick={() => { setEditGoal(null); setGoalForm({ name: "", targetAmount: "", currentAmount: "", deadline: "", icon: "🎯" }); setShowGoalModal(true); }}>
                <Plus size={12} /> Add Goal
              </Button>
            </CardHeader>
            <div className="space-y-3">
              {goals.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <Target size={32} className="mx-auto mb-2 opacity-30" />
                  No goals yet. Add one to get started!
                </div>
              )}
              {goals.map((goal, i) => {
                const pct = calculatePercentage(goal.currentAmount, goal.targetAmount);
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors group"
                  >
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground">{goal.name}</p>
                        <span className="text-xs font-bold text-violet-400">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full bg-violet-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)} · Due: {goal.deadline}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditGoal(goal)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-all">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => { deleteGoal(goal.id); toast.success("Goal deleted"); }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-rose-500/15 text-muted-foreground hover:text-rose-400 transition-all">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Danger zone */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader><CardTitle className="text-rose-400">Danger Zone</CardTitle></CardHeader>
            <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5">
              <p className="text-sm text-foreground mb-2 font-medium">Reset Onboarding</p>
              <p className="text-xs text-muted-foreground mb-3">This will clear your profile and take you back to the setup flow.</p>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (confirm("Are you sure? This will reset all settings.")) {
                    resetOnboarding();
                    router.replace("/onboarding");
                  }
                }}
              >
                <LogOut size={12} /> Reset & Start Over
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Goal Modal */}
      <Modal open={showGoalModal} onClose={() => setShowGoalModal(false)} title={editGoal ? "Edit Goal" : "Add Goal"}>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div>
              <p className="text-sm font-medium text-foreground mb-1.5">Icon</p>
              <input
                type="text"
                value={goalForm.icon}
                onChange={(e) => setGoalForm((f) => ({ ...f, icon: e.target.value }))}
                className="w-14 h-11 text-center text-2xl rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex-1">
              <Input
                label="Goal Name"
                placeholder="e.g. Emergency Fund"
                value={goalForm.name}
                onChange={(e) => setGoalForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Target Amount (₹)"
              type="number"
              placeholder="100000"
              prefix="₹"
              value={goalForm.targetAmount}
              onChange={(e) => setGoalForm((f) => ({ ...f, targetAmount: e.target.value }))}
            />
            <Input
              label="Current Amount (₹)"
              type="number"
              placeholder="0"
              prefix="₹"
              value={goalForm.currentAmount}
              onChange={(e) => setGoalForm((f) => ({ ...f, currentAmount: e.target.value }))}
            />
          </div>
          <Input
            label="Deadline"
            type="date"
            value={goalForm.deadline}
            onChange={(e) => setGoalForm((f) => ({ ...f, deadline: e.target.value }))}
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowGoalModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleAddGoal} className="flex-1">{editGoal ? "Update Goal" : "Add Goal"}</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
