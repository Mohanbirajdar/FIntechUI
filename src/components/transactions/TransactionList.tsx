"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useAppStore } from "@/store/useAppStore";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AddTransactionModal } from "./AddTransactionModal";
import { Pencil, Trash2, AlertTriangle, CheckSquare, Square, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types";

const PAGE_SIZE = 15;

export function TransactionList() {
  const { getFilteredTransactions, deleteTransaction, bulkDelete, toggleSelect, selectAll, clearSelection, selectedIds } = useTransactionStore();
  const { role } = useAppStore();
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [page, setPage] = useState(1);

  const filtered = getFilteredTransactions();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isAdmin = role === "admin";

  const handleDelete = (id: string) => {
    if (confirm("Delete this transaction?")) {
      deleteTransaction(id);
      toast.success("Transaction deleted");
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} transactions?`)) {
      bulkDelete(selectedIds);
      toast.success(`${selectedIds.length} transactions deleted`);
    }
  };

  const allPageIds = paginated.map((t) => t.id);
  const allSelected = allPageIds.every((id) => selectedIds.includes(id));

  if (filtered.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <span className="text-6xl mb-4">🔍</span>
        <h3 className="text-lg font-semibold text-foreground mb-2">No transactions found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or adding a new transaction</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Bulk actions */}
      {isAdmin && selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl"
        >
          <span className="text-sm font-medium text-violet-400">
            {selectedIds.length} selected
          </span>
          <Button variant="danger" size="sm" onClick={handleBulkDelete}>
            <Trash2 size={12} /> Delete Selected
          </Button>
          <Button variant="ghost" size="sm" onClick={clearSelection}>
            Clear
          </Button>
        </motion.div>
      )}

      {/* Header row */}
      {isAdmin && (
        <div className="flex items-center gap-3 px-3 py-1">
          <button
            onClick={() => allSelected ? clearSelection() : selectAll(allPageIds)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {allSelected ? <CheckSquare size={16} className="text-violet-400" /> : <Square size={16} />}
          </button>
          <span className="text-xs text-muted-foreground">Select all on page</span>
        </div>
      )}

      {/* Transaction rows */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {paginated.map((tx, i) => {
            const isSelected = selectedIds.includes(tx.id);
            return (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: i * 0.02, duration: 0.2 }}
                whileHover={{ x: 2 }}
                className={cn(
                  "flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200 group",
                  "glass-card hover:border-violet-500/30",
                  isSelected && "border-violet-500/50 bg-violet-500/5"
                )}
              >
                {/* Checkbox (admin only) */}
                {isAdmin && (
                  <button
                    onClick={() => toggleSelect(tx.id)}
                    className="text-muted-foreground hover:text-violet-400 transition-colors shrink-0"
                  >
                    {isSelected ? (
                      <CheckSquare size={16} className="text-violet-400" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                )}

                {/* Category icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: `${CATEGORY_COLORS[tx.category]}20` }}
                >
                  {CATEGORY_ICONS[tx.category]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {tx.notes || tx.category}
                    </p>
                    {tx.isAnomalous && (
                      <span title="Unusual transaction" className="flex items-center gap-0.5 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                        <AlertTriangle size={9} /> Unusual
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{tx.category}</span>
                    <span className="text-muted-foreground/40 text-xs">·</span>
                    <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <p className={cn(
                    "text-base font-bold",
                    tx.type === "income" ? "text-emerald-500" : "text-rose-400"
                  )}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </p>
                  <Badge variant={tx.type === "income" ? "income" : "expense"}>
                    {tx.type}
                  </Badge>
                </div>

                {/* Admin actions */}
                {isAdmin && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => setEditTx(tx)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-rose-500/15 text-muted-foreground hover:text-rose-400 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={14} /> Prev
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                    page === pageNum
                      ? "gradient-primary text-white shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next <ChevronRight size={14} />
          </Button>
        </div>
      )}

      {/* Edit modal */}
      {editTx && (
        <AddTransactionModal
          open={!!editTx}
          onClose={() => setEditTx(null)}
          editTransaction={editTx ?? undefined}
        />
      )}
    </div>
  );
}
