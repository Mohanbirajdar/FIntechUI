"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { EXPENSE_CATEGORIES, Category, OnboardingData } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ArrowRight, ArrowLeft, Check, Sparkles, Target,
  ShoppingBag, DollarSign, SkipForward, User, Wallet, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 5;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export function OnboardingFlow() {
  const router = useRouter();
  const { onboarding, updateOnboarding, completeOnboarding, setRole } = useAppStore();
  const { initializeMockData } = useTransactionStore();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedRole, setSelectedRole] = useState<"user" | "admin" | null>(null);

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
    setErrors({});
  };

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0 && !selectedRole) { e.role = "Please select a role to continue"; }
    if (step === 1) {
      if (!onboarding.fullName.trim()) e.fullName = "Name is required";
      if (!onboarding.email.trim() && !onboarding.phone.trim()) e.email = "Email or phone required";
    }
    if (step === 2) {
      if (!onboarding.monthlyIncome) e.monthlyIncome = "Enter your monthly income";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRoleSelect = (role: "user" | "admin") => {
    setSelectedRole(role);
    setErrors({});
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step === 0) {
      if (selectedRole === "admin") {
        setRole("admin");
        router.push("/admin/login");
        return;
      }
      setRole("user");
      go(1);
      return;
    }
    if (step < TOTAL_STEPS - 1) go(step + 1);
    else handleFinish();
  };

  const handleFinish = () => {
    completeOnboarding();
    initializeMockData();
    router.push("/dashboard");
  };

  const handleSkip = () => {
    updateOnboarding({ fullName: "Demo User", monthlyIncome: 75000, savingsGoal: 20000 });
    completeOnboarding();
    initializeMockData();
    router.push("/dashboard");
  };

  const progressPct = step === 0 ? 0 : ((step) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* Progress bar */}
      {step > 0 && (
        <div className="w-full max-w-md mb-6 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Step {step} of {TOTAL_STEPS - 1}</span>
            <button onClick={handleSkip} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <SkipForward size={12} /> Skip
            </button>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,#7c3aed,#4f46e5)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {Array.from({ length: TOTAL_STEPS - 1 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  i + 1 < step ? "text-white" :
                  i + 1 === step ? "border-2 border-violet-500 text-violet-400 bg-violet-500/10" :
                  "bg-muted text-muted-foreground"
                )}
                style={i + 1 < step ? { background: "linear-gradient(135deg,#7c3aed,#4f46e5)" } : {}}
              >
                {i + 1 < step ? <Check size={12} /> : i + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-3xl p-8 shadow-2xl min-h-[420px] flex flex-col">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col"
            >
              <StepContent
                step={step}
                onboarding={onboarding}
                updateOnboarding={updateOnboarding}
                errors={errors}
                selectedRole={selectedRole}
                onRoleSelect={handleRoleSelect}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
            {step > 1 ? (
              <Button variant="ghost" size="sm" onClick={() => go(step - 1)}>
                <ArrowLeft size={14} /> Back
              </Button>
            ) : <div />}

            <Button onClick={handleNext} size="md">
              {step === 0 && selectedRole === "admin" ? (
                <>Admin Login <Shield size={14} /></>
              ) : step === TOTAL_STEPS - 1 ? (
                <>Get Started <Sparkles size={14} /></>
              ) : (
                <>Continue <ArrowRight size={14} /></>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepContent({
  step, onboarding, updateOnboarding, errors, selectedRole, onRoleSelect,
}: {
  step: number;
  onboarding: OnboardingData;
  updateOnboarding: (d: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
  selectedRole: "user" | "admin" | null;
  onRoleSelect: (r: "user" | "admin") => void;
}) {
  switch (step) {
    case 0: return <WelcomeStep selectedRole={selectedRole} onRoleSelect={onRoleSelect} roleError={errors.role} />;
    case 1: return <PersonalInfoStep onboarding={onboarding} update={updateOnboarding} errors={errors} />;
    case 2: return <FinancialSetupStep onboarding={onboarding} update={updateOnboarding} errors={errors} />;
    case 3: return <SpendingPrefsStep onboarding={onboarding} update={updateOnboarding} />;
    case 4: return <BudgetSetupStep onboarding={onboarding} update={updateOnboarding} />;
    default: return null;
  }
}

function WelcomeStep({ selectedRole, onRoleSelect, roleError }: {
  selectedRole: "user" | "admin" | null;
  onRoleSelect: (r: "user" | "admin") => void;
  roleError?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-2">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
          <Wallet size={48} className="text-white" />
        </div>
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
        >
          <Sparkles size={14} className="text-amber-900" />
        </motion.div>
      </motion.div>

      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-foreground mb-1"
        >
          Welcome to{" "}
          <span style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            FinTrack
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-sm leading-relaxed"
        >
          Your personal finance companion. Choose how you&apos;d like to continue.
        </motion.p>
      </div>

      {/* Role Selection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full space-y-2"
      >
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Select your role</p>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onRoleSelect("user")}
            className={cn(
              "relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer",
              selectedRole === "user"
                ? "border-violet-500 bg-violet-500/10"
                : "border-border hover:border-violet-500/40 bg-card"
            )}
          >
            {selectedRole === "user" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
              >
                <Check size={10} className="text-white" />
              </motion.div>
            )}
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              selectedRole === "user" ? "bg-violet-500/20" : "bg-muted"
            )}>
              <User size={22} className={selectedRole === "user" ? "text-violet-400" : "text-muted-foreground"} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">User</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Personal finance tracking</p>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onRoleSelect("admin")}
            className={cn(
              "relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer",
              selectedRole === "admin"
                ? "border-amber-500 bg-amber-500/10"
                : "border-border hover:border-amber-500/40 bg-card"
            )}
          >
            {selectedRole === "admin" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center"
              >
                <Check size={10} className="text-white" />
              </motion.div>
            )}
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              selectedRole === "admin" ? "bg-amber-500/20" : "bg-muted"
            )}>
              <Shield size={22} className={selectedRole === "admin" ? "text-amber-400" : "text-muted-foreground"} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">Admin</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Platform management</p>
            </div>
          </motion.button>
        </div>

        {roleError && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-destructive text-center">
            {roleError}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-2 flex-wrap justify-center"
      >
        {["📊 Analytics", "🎯 Goal Tracking", "🔔 Alerts"].map((f) => (
          <span key={f} className="text-xs px-3 py-1 rounded-full border" style={{ background: "rgba(124,58,237,0.1)", borderColor: "rgba(124,58,237,0.2)", color: "#a78bfa" }}>
            {f}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function PersonalInfoStep({
  onboarding, update, errors,
}: {
  onboarding: OnboardingData;
  update: (d: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <User size={18} className="text-violet-400" />
          <h2 className="text-xl font-bold text-foreground">Personal Info</h2>
        </div>
        <p className="text-sm text-muted-foreground">Tell us a bit about yourself</p>
      </div>
      <Input
        label="Full Name"
        placeholder="Arjun Sharma"
        value={onboarding.fullName}
        onChange={(e) => update({ fullName: e.target.value })}
        error={errors.fullName}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Age"
          type="number"
          placeholder="25"
          value={onboarding.age}
          onChange={(e) => update({ age: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="arjun@email.com"
          value={onboarding.email}
          onChange={(e) => update({ email: e.target.value })}
          error={errors.email}
        />
      </div>
      <Input
        label="Phone (optional)"
        placeholder="+91 98765 43210"
        value={onboarding.phone}
        onChange={(e) => update({ phone: e.target.value })}
      />
    </div>
  );
}

function FinancialSetupStep({
  onboarding, update, errors,
}: {
  onboarding: OnboardingData;
  update: (d: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <DollarSign size={18} className="text-violet-400" />
          <h2 className="text-xl font-bold text-foreground">Financial Setup</h2>
        </div>
        <p className="text-sm text-muted-foreground">Set your income and savings targets</p>
      </div>
      <Input
        label="Monthly Income (₹)"
        type="number"
        placeholder="75000"
        prefix="₹"
        value={onboarding.monthlyIncome || ""}
        onChange={(e) => update({ monthlyIncome: Number(e.target.value) })}
        error={errors.monthlyIncome}
      />
      <Input
        label="Monthly Savings Goal (₹)"
        type="number"
        placeholder="15000"
        prefix="₹"
        value={onboarding.savingsGoal || ""}
        onChange={(e) => update({ savingsGoal: Number(e.target.value) })}
      />
      {onboarding.monthlyIncome > 0 && onboarding.savingsGoal > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl border"
          style={{ background: "rgba(124,58,237,0.1)", borderColor: "rgba(124,58,237,0.2)" }}
        >
          <p className="text-xs font-medium" style={{ color: "#a78bfa" }}>
            💡 Savings rate:{" "}
            <span className="font-bold">
              {Math.round((onboarding.savingsGoal / onboarding.monthlyIncome) * 100)}%
            </span>{" "}
            of monthly income
          </p>
        </motion.div>
      )}
    </div>
  );
}

function SpendingPrefsStep({
  onboarding, update,
}: {
  onboarding: OnboardingData;
  update: (d: Partial<OnboardingData>) => void;
}) {
  const toggle = (cat: Category) => {
    const selected = onboarding.selectedCategories.includes(cat)
      ? onboarding.selectedCategories.filter((c) => c !== cat)
      : [...onboarding.selectedCategories, cat];
    update({ selectedCategories: selected });
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShoppingBag size={18} className="text-violet-400" />
          <h2 className="text-xl font-bold text-foreground">Spending Categories</h2>
        </div>
        <p className="text-sm text-muted-foreground">Select categories you spend in</p>
      </div>
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto no-scrollbar">
        {EXPENSE_CATEGORIES.map((cat) => {
          const isSelected = onboarding.selectedCategories.includes(cat);
          return (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggle(cat)}
              className={cn(
                "p-2.5 rounded-xl border text-left text-xs font-medium transition-all duration-200 flex items-center gap-2",
                isSelected
                  ? "border-violet-500 text-violet-400"
                  : "border-border text-muted-foreground hover:border-violet-500/50"
              )}
              style={isSelected ? { background: "rgba(124,58,237,0.1)" } : { background: "rgba(0,0,0,0.02)" }}
            >
              <span className="text-sm">{getCatIcon(cat)}</span>
              <span className="leading-tight">{cat}</span>
              {isSelected && <Check size={10} className="ml-auto text-violet-400" />}
            </motion.button>
          );
        })}
      </div>
      {onboarding.selectedCategories.length > 0 && (
        <p className="text-xs text-muted-foreground">{onboarding.selectedCategories.length} categories selected</p>
      )}
    </div>
  );
}

function BudgetSetupStep({
  onboarding, update,
}: {
  onboarding: OnboardingData;
  update: (d: Partial<OnboardingData>) => void;
}) {
  const cats = onboarding.selectedCategories.length > 0
    ? onboarding.selectedCategories
    : EXPENSE_CATEGORIES.slice(0, 5);

  const setBudget = (cat: Category, val: number) => {
    update({ budgets: { ...onboarding.budgets, [cat]: val } });
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Target size={18} className="text-violet-400" />
          <h2 className="text-xl font-bold text-foreground">Budget Setup</h2>
        </div>
        <p className="text-sm text-muted-foreground">Set monthly limits per category</p>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
        {cats.map((cat) => (
          <div key={cat} className="flex items-center gap-3">
            <span className="text-lg w-7">{getCatIcon(cat)}</span>
            <span className="text-xs font-medium text-foreground flex-1 truncate">{cat}</span>
            <div className="relative w-28">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
              <input
                type="number"
                placeholder="5000"
                value={onboarding.budgets[cat] || ""}
                onChange={(e) => setBudget(cat, Number(e.target.value))}
                className="w-full h-8 rounded-lg border border-border bg-background pl-5 pr-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getCatIcon(cat: Category): string {
  const icons: Record<string, string> = {
    "Food & Dining": "🍕", "Transportation": "🚗", "Shopping": "🛍️",
    "Entertainment": "🎬", "Bills & Utilities": "⚡", "Health & Medical": "🏥",
    "Travel": "✈️", "Education": "📚", "Other": "💰",
  };
  return icons[cat] || "💰";
}
