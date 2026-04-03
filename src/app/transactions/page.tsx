"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionList } from "@/components/transactions/TransactionList";
import { AddTransactionModal } from "@/components/transactions/AddTransactionModal";
import { Button } from "@/components/ui/Button";
import { downloadCSV, downloadJSON, formatCurrency } from "@/lib/utils";
import {
  Plus, Download, Upload, Mic, MicOff
} from "lucide-react";
import { toast } from "sonner";

export default function TransactionsPage() {
  const { isOnboardingComplete, role, theme, setTheme } = useAppStore();
  const { getFilteredTransactions, transactions, importTransactions } = useTransactionStore();
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setTheme(theme);
    if (!isOnboardingComplete) router.replace("/onboarding");
  }, [isOnboardingComplete, router, theme, setTheme]);

  if (!isOnboardingComplete) return null;

  const filtered = getFilteredTransactions();
  const isAdmin = role === "admin";

  const handleExportCSV = () => {
    const data = filtered.map((t) => ({
      date: t.date, amount: t.amount, category: t.category,
      type: t.type, notes: t.notes,
    }));
    downloadCSV(data as Record<string, unknown>[], "transactions.csv");
    toast.success("Exported as CSV");
  };

  const handleExportJSON = () => {
    downloadJSON(filtered, "transactions.json");
    toast.success("Exported as JSON");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (Array.isArray(data)) {
          importTransactions(data);
          toast.success(`Imported ${data.length} transactions`);
        } else {
          toast.error("Invalid file format");
        }
      } catch {
        toast.error("Failed to parse file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const simulateVoice = () => {
    setIsListening(true);
    setVoiceText("Listening...");
    setTimeout(() => {
      const samples = [
        "Added ₹500 Food & Dining expense – Swiggy order",
        "Added ₹200 Transportation expense – Uber ride",
        "Added ₹2000 Shopping expense – Amazon purchase",
      ];
      const msg = samples[Math.floor(Math.random() * samples.length)];
      setVoiceText(msg);
      toast.success(`🎤 Voice: "${msg}"`);
      setTimeout(() => {
        setIsListening(false);
        setVoiceText("");
      }, 2000);
    }, 1500);
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 26 } },
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="show"
        className="space-y-5"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-start justify-between gap-4 flex-wrap pt-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filtered.length} of {transactions.length} transactions
              {filtered.length > 0 && (
                <> · Total: {formatCurrency(filtered.reduce((s, t) => t.type === "expense" ? s + t.amount : s - t.amount, 0))}</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Voice input */}
            <Button
              variant={isListening ? "danger" : "outline"}
              size="sm"
              onClick={simulateVoice}
              disabled={isListening}
            >
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
              {isListening ? "Listening..." : "Voice Input"}
            </Button>

            {/* Export */}
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download size={14} /> CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportJSON}>
                <Download size={14} /> JSON
              </Button>
            </div>

            {/* Import (admin only) */}
            {isAdmin && (
              <>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={14} /> Import
                </Button>
                <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
              </>
            )}

            {/* Add (admin only) */}
            {isAdmin && (
              <Button size="sm" onClick={() => setShowAdd(true)}>
                <Plus size={14} /> Add Transaction
              </Button>
            )}
          </div>
        </motion.div>

        {/* Voice feedback */}
        {voiceText && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl text-sm text-violet-400 flex items-center gap-2"
          >
            <Mic size={14} className="animate-pulse" />
            {voiceText}
          </motion.div>
        )}

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <TransactionFilters />
        </motion.div>

        {/* List */}
        <motion.div variants={itemVariants}>
          <TransactionList />
        </motion.div>

        <AddTransactionModal open={showAdd} onClose={() => setShowAdd(false)} />
      </motion.div>
    </DashboardLayout>
  );
}
