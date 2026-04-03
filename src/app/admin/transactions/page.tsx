"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useTransactionStore } from "@/store/useTransactionStore";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/types";
import { formatCurrency, formatDate, downloadCSV, downloadJSON } from "@/lib/utils";
import { Search, Download, Trash2, AlertTriangle, CheckSquare, Square, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

export default function AdminTransactionsPage() {
  const { transactions, deleteTransaction, bulkDelete, filters, setFilter, resetFilters } = useTransactionStore();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.notes.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    return result;
  }, [transactions, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allPageIds = paginated.map((t) => t.id);
  const allSelected = allPageIds.length > 0 && allPageIds.every((id) => selectedIds.includes(id));

  const toggle = (id: string) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} transactions?`)) {
      bulkDelete(selectedIds);
      setSelectedIds([]);
      toast.success("Transactions deleted");
    }
  };

  const exportCSV = () => {
    downloadCSV(filtered.map((t) => ({ date: t.date, amount: t.amount, category: t.category, type: t.type, notes: t.notes })) as Record<string, unknown>[], "admin_transactions.csv");
    toast.success("Exported CSV");
  };

  const exportJSON = () => {
    downloadJSON(filtered, "admin_transactions.json");
    toast.success("Exported JSON");
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 sm:space-y-5">
        <div className="flex items-start justify-between flex-col sm:flex-row gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transaction Management</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">{filtered.length} of {transactions.length} transactions</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full sm:w-auto">
            {selectedIds.length > 0 && (
              <Button variant="danger" size="sm" onClick={handleBulkDelete} className="text-xs">
                <Trash2 size={12} /> Delete ({selectedIds.length})
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={exportCSV} className="text-xs"><Download size={12} /> CSV</Button>
            <Button variant="outline" size="sm" onClick={exportJSON} className="text-xs"><Download size={12} /> JSON</Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <div className="flex-1 min-w-full sm:min-w-48">
            <Input placeholder="Search transactions..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              icon={<Search size={14} />}
              iconRight={search ? <button onClick={() => setSearch("")}><X size={12} /></button> : undefined}
            />
          </div>
        </div>

        {/* Bulk actions */}
        {selectedIds.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl border text-xs sm:text-sm" style={{ background: "rgba(139,92,246,0.08)", borderColor: "rgba(139,92,246,0.2)" }}>
            <span className="font-medium text-violet-400">{selectedIds.length} selected</span>
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="text-xs">Clear</Button>
          </motion.div>
        )}

        {/* Table - Desktop */}
        <div className="rounded-2xl border border-border overflow-hidden hidden md:block" style={{ background: "var(--card)" }}>
          <div className="p-4 border-b border-border flex items-center gap-3">
            <button onClick={() => allSelected ? setSelectedIds([]) : setSelectedIds(allPageIds)}
              className="text-muted-foreground hover:text-foreground transition-colors">
              {allSelected ? <CheckSquare size={16} className="text-violet-400" /> : <Square size={16} />}
            </button>
            <span className="text-xs text-muted-foreground">Select all on page</span>
          </div>

          <div className="divide-y divide-border/50">
            <AnimatePresence initial={false}>
              {paginated.map((tx, i) => {
                const isSelected = selectedIds.includes(tx.id);
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.01 }}
                    className={cn("flex items-center gap-4 px-4 py-3 hover:bg-accent/20 transition-colors group", isSelected && "bg-violet-500/5")}
                  >
                    <button onClick={() => toggle(tx.id)} className="text-muted-foreground hover:text-violet-400 transition-colors">
                      {isSelected ? <CheckSquare size={15} className="text-violet-400" /> : <Square size={15} />}
                    </button>

                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                      style={{ background: `${CATEGORY_COLORS[tx.category]}20` }}>
                      {CATEGORY_ICONS[tx.category]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{tx.notes || tx.category}</p>
                        {tx.isAnomalous && <AlertTriangle size={11} className="text-amber-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{tx.category} · {formatDate(tx.date)}</p>
                    </div>

                    <Badge variant={tx.type === "income" ? "income" : "expense"}>{tx.type}</Badge>

                    <p className={cn("text-sm font-bold w-28 text-right", tx.type === "income" ? "text-emerald-500" : "text-rose-400")}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </p>

                    <button
                      onClick={() => { if (confirm("Delete?")) { deleteTransaction(tx.id); toast.success("Deleted"); } }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-500/15 text-muted-foreground hover:text-rose-400 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-muted-foreground text-sm">No transactions found</p>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="space-y-2 md:hidden">
          <AnimatePresence initial={false}>
            {paginated.map((tx, i) => {
              const isSelected = selectedIds.includes(tx.id);
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.01 }}
                  className={cn("flex items-start gap-2 p-3 rounded-xl border transition-all", isSelected && "bg-violet-500/5 border-violet-500/30")}
                  style={{ background: "var(--card)" }}
                >
                  <button onClick={() => toggle(tx.id)} className="text-muted-foreground hover:text-violet-400 transition-colors mt-0.5 shrink-0">
                    {isSelected ? <CheckSquare size={16} className="text-violet-400" /> : <Square size={16} />}
                  </button>

                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                    style={{ background: `${CATEGORY_COLORS[tx.category]}20` }}>
                    {CATEGORY_ICONS[tx.category]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{tx.notes || tx.category}</p>
                      {tx.isAnomalous && <AlertTriangle size={10} className="text-amber-400 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{tx.category} · {formatDate(tx.date)}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={cn("text-xs sm:text-sm font-bold", tx.type === "income" ? "text-emerald-500" : "text-rose-400")}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </p>
                    <Badge variant={tx.type === "income" ? "income" : "expense"} className="text-[9px] mt-0.5 inline-block">{tx.type}</Badge>
                  </div>

                  <button
                    onClick={() => { if (confirm("Delete?")) { deleteTransaction(tx.id); toast.success("Deleted"); } }}
                    className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-rose-500/15 text-muted-foreground hover:text-rose-400 transition-all shrink-0"
                  >
                    <Trash2 size={12} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground text-xs">No transactions found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="text-xs">
              <ChevronLeft size={14} /> Prev
            </Button>
            <span className="text-xs sm:text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-xs">
              Next <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
