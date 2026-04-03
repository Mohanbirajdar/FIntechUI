"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { useTransactionStore } from "@/store/useTransactionStore";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, Category } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

export function TransactionFilters() {
  const { filters, setFilter, resetFilters } = useTransactionStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.type !== "all" ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.amountMin ||
    filters.amountMax;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search by category or notes..."
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            icon={<Search size={14} />}
            iconRight={
              filters.search ? (
                <button onClick={() => setFilter("search", "")} className="hover:text-foreground transition-colors">
                  <X size={14} />
                </button>
              ) : undefined
            }
          />
        </div>

        <Button
          variant={showAdvanced ? "primary" : "outline"}
          size="icon"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="relative"
        >
          <SlidersHorizontal size={16} />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold">
              !
            </span>
          )}
        </Button>

        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("-");
            setFilter("sortBy", sortBy as "date" | "amount");
            setFilter("sortOrder", sortOrder as "asc" | "desc");
          }}
          className="w-36 h-10"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </Select>
      </div>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Select
                  label="Category"
                  value={filters.category}
                  onChange={(e) => setFilter("category", e.target.value as Category | "all")}
                >
                  <option value="all">All Categories</option>
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>

                <Select
                  label="Type"
                  value={filters.type}
                  onChange={(e) => setFilter("type", e.target.value as "income" | "expense" | "all")}
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Select>

                <Input
                  label="From Date"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilter("dateFrom", e.target.value)}
                />

                <Input
                  label="To Date"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilter("dateTo", e.target.value)}
                />

                <Input
                  label="Min Amount (₹)"
                  type="number"
                  placeholder="0"
                  value={filters.amountMin}
                  onChange={(e) => setFilter("amountMin", e.target.value)}
                  prefix="₹"
                />

                <Input
                  label="Max Amount (₹)"
                  type="number"
                  placeholder="100000"
                  value={filters.amountMax}
                  onChange={(e) => setFilter("amountMax", e.target.value)}
                  prefix="₹"
                />
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <X size={12} /> Clear All Filters
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter pills */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-2"
        >
          {filters.category !== "all" && (
            <FilterPill label={`Category: ${filters.category}`} onRemove={() => setFilter("category", "all")} />
          )}
          {filters.type !== "all" && (
            <FilterPill label={`Type: ${filters.type}`} onRemove={() => setFilter("type", "all")} />
          )}
          {filters.dateFrom && (
            <FilterPill label={`From: ${filters.dateFrom}`} onRemove={() => setFilter("dateFrom", "")} />
          )}
          {filters.dateTo && (
            <FilterPill label={`To: ${filters.dateTo}`} onRemove={() => setFilter("dateTo", "")} />
          )}
          {filters.amountMin && (
            <FilterPill label={`Min: ₹${filters.amountMin}`} onRemove={() => setFilter("amountMin", "")} />
          )}
          {filters.amountMax && (
            <FilterPill label={`Max: ₹${filters.amountMax}`} onRemove={() => setFilter("amountMax", "")} />
          )}
        </motion.div>
      )}
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-500/15 text-violet-400 border border-violet-500/20 rounded-full text-xs font-medium"
    >
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors ml-0.5">
        <X size={10} />
      </button>
    </motion.span>
  );
}
