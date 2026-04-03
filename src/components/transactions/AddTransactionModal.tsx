"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useTransactionStore } from "@/store/useTransactionStore";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TransactionType, Category, CATEGORY_ICONS } from "@/types";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  editTransaction?: { id: string; date: string; amount: number; category: Category; type: TransactionType; notes: string };
}

export function AddTransactionModal({ open, onClose, editTransaction }: Props) {
  const { addTransaction, updateTransaction } = useTransactionStore();

  const [form, setForm] = useState({
    date: editTransaction?.date || new Date().toISOString().split("T")[0],
    amount: editTransaction?.amount?.toString() || "",
    category: editTransaction?.category || ("Food & Dining" as Category),
    type: (editTransaction?.type || "expense") as TransactionType,
    notes: editTransaction?.notes || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.amount || Number(form.amount) <= 0) e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Date is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const tx = {
      date: form.date,
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
      notes: form.notes,
    };

    if (editTransaction) {
      updateTransaction(editTransaction.id, tx);
      toast.success("Transaction updated!");
    } else {
      addTransaction(tx);
      toast.success("Transaction added!");
    }

    onClose();
    setForm({ date: new Date().toISOString().split("T")[0], amount: "", category: "Food & Dining", type: "expense", notes: "" });
  };

  const categories = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editTransaction ? "Edit Transaction" : "Add Transaction"}
      size="md"
    >
      <div className="space-y-4">
        {/* Type toggle */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          {(["expense", "income"] as TransactionType[]).map((t) => (
            <motion.button
              key={t}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                set("type", t);
                set("category", t === "income" ? "Salary" : "Food & Dining");
              }}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold capitalize transition-all duration-200",
                form.type === t
                  ? t === "income"
                    ? "bg-emerald-500 text-white"
                    : "bg-rose-500 text-white"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "income" ? "💚" : "🔴"} {t}
            </motion.button>
          ))}
        </div>

        <Input
          label="Amount (₹)"
          type="number"
          placeholder="500"
          prefix="₹"
          value={form.amount}
          onChange={(e) => set("amount", e.target.value)}
          error={errors.amount}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            error={errors.date}
          />

          <Select
            label="Category"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_ICONS[c]} {c}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Notes (optional)"
          placeholder="e.g. Dinner with friends"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
        />

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            {editTransaction ? "Update" : "Add Transaction"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
