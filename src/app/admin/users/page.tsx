"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminStore } from "@/store/useAdminStore";
import { MockUser } from "@/lib/adminMockData";
import { formatCurrency } from "@/lib/utils";
import {
  Search, Filter, Trash2, UserCheck, UserX, Users,
  TrendingUp, ChevronDown, MoreVertical, X
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  inactive: "bg-muted text-muted-foreground border-border",
  suspended: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

const PERSONALITY_COLORS: Record<string, string> = {
  Saver: "bg-emerald-500/15 text-emerald-500",
  Balanced: "bg-violet-500/15 text-violet-400",
  Spender: "bg-amber-500/15 text-amber-500",
};

export default function UsersPage() {
  const { users, updateUserStatus, deleteUser } = useAdminStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPersonality, setFilterPersonality] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "transactions" | "spent" | "joinedAt">("transactions");
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let result = [...users];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (filterStatus !== "all") result = result.filter((u) => u.status === filterStatus);
    if (filterPersonality !== "all") result = result.filter((u) => u.personality === filterPersonality);
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "transactions") return b.totalTransactions - a.totalTransactions;
      if (sortBy === "spent") return b.totalSpent - a.totalSpent;
      return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
    });
    return result;
  }, [users, search, filterStatus, filterPersonality, sortBy]);

  const handleStatusChange = (id: string, status: MockUser["status"]) => {
    updateUserStatus(id, status);
    toast.success(`User ${status}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this user?")) {
      deleteUser(id);
      if (selectedUser?.id === id) setSelectedUser(null);
      toast.success("User deleted");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const avgSpend = users.length ? Math.round(users.reduce((s, u) => s + u.totalSpent, 0) / users.length) : 0;

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between flex-col sm:flex-row gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-sm text-muted-foreground">{users.length} registered users</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3 text-center w-full sm:w-auto">
            {[
              { label: "Total", value: users.length, color: "text-violet-400" },
              { label: "Active", value: users.filter((u) => u.status === "active").length, color: "text-emerald-500" },
              { label: "Suspended", value: users.filter((u) => u.status === "suspended").length, color: "text-rose-400" },
              { label: "Avg Spend", value: formatCurrency(avgSpend), color: "text-amber-400" },
            ].map((s) => (
              <div key={s.label} className="px-2 sm:px-4 py-2 rounded-xl border border-border text-xs sm:text-base" style={{ background: "var(--card)" }}>
                <div className={`text-base sm:text-lg font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
          <div className="flex-1 min-w-full sm:min-w-48">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={14} />}
              iconRight={search ? <button onClick={() => setSearch("")}><X size={12} /></button> : undefined}
            />
          </div>
          {[
            { label: "Status", val: filterStatus, set: setFilterStatus, opts: ["all", "active", "inactive", "suspended"] },
            { label: "Type", val: filterPersonality, set: setFilterPersonality, opts: ["all", "Saver", "Balanced", "Spender"] },
            { label: "Sort", val: sortBy, set: setSortBy as (v: string) => void, opts: ["transactions", "spent", "name", "joinedAt"] },
          ].map((f) => (
            <div key={f.label} className="relative">
              <select
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="h-11 rounded-xl border border-border bg-card px-3 pr-8 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
              >
                {f.opts.map((o) => <option key={o} value={o}>{o === "all" ? `All ${f.label}` : o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          ))}

          {selectedIds.length > 0 && (
            <Button variant="danger" size="sm" onClick={() => {
              if (confirm(`Delete ${selectedIds.length} users?`)) {
                selectedIds.forEach(deleteUser);
                setSelectedIds([]);
                toast.success("Users deleted");
              }
            }}>
              <Trash2 size={12} /> Delete ({selectedIds.length})
            </Button>
          )}
        </div>

        {/* Table - Desktop */}
        <div className="rounded-2xl border border-border overflow-x-auto hidden md:block" style={{ background: "var(--card)" }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left">
                  <input type="checkbox"
                    checked={filtered.length > 0 && filtered.every((u) => selectedIds.includes(u.id))}
                    onChange={(e) => setSelectedIds(e.target.checked ? filtered.map((u) => u.id) : [])}
                    className="rounded"
                  />
                </th>
                {["User", "Status", "Type", "Transactions", "Total Spent", "Savings Rate", "Joined", "Actions"].map((h) => (
                  <th key={h} className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtered.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={cn(
                      "border-b border-border/50 hover:bg-accent/30 transition-colors cursor-pointer group",
                      selectedIds.includes(user.id) && "bg-violet-500/5"
                    )}
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox"
                        checked={selectedIds.includes(user.id)}
                        onChange={() => toggleSelect(user.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                          style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                          {user.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn("text-xs font-semibold px-2 py-1 rounded-full border", STATUS_COLORS[user.status])}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", PERSONALITY_COLORS[user.personality])}>
                        {user.personality === "Saver" ? "🏆" : user.personality === "Spender" ? "💸" : "⚖️"} {user.personality}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-foreground">{user.totalTransactions}</td>
                    <td className="p-4 text-sm font-medium text-foreground">{formatCurrency(user.totalSpent)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${Math.min(user.savingsRate, 100)}%` }} />
                        </div>
                        <span className="text-xs text-foreground font-medium">{user.savingsRate}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">{user.joinedAt}</td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user.status !== "active" ? (
                          <button onClick={() => handleStatusChange(user.id, "active")}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-emerald-500/15 text-muted-foreground hover:text-emerald-400 transition-all"
                            title="Activate">
                            <UserCheck size={13} />
                          </button>
                        ) : (
                          <button onClick={() => handleStatusChange(user.id, "suspended")}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-amber-500/15 text-muted-foreground hover:text-amber-400 transition-all"
                            title="Suspend">
                            <UserX size={13} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(user.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-rose-500/15 text-muted-foreground hover:text-rose-400 transition-all"
                          title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Users size={40} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No users found</p>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="space-y-3 md:hidden">
          <AnimatePresence initial={false}>
            {filtered.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: i * 0.02 }}
                className={cn(
                  "rounded-xl border border-border p-3 cursor-pointer transition-all",
                  selectedIds.includes(user.id) && "bg-violet-500/5 border-violet-500/30"
                )}
                style={{ background: "var(--card)" }}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <input type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded mt-0.5"
                  />
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                    className="text-muted-foreground hover:text-rose-400 transition-colors p-1">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="text-xs">
                    <span className="text-muted-foreground block">Status</span>
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full border inline-block mt-0.5", STATUS_COLORS[user.status])}>
                      {user.status}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground block">Type</span>
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full inline-block mt-0.5", PERSONALITY_COLORS[user.personality])}>
                      {user.personality === "Saver" ? "🏆" : user.personality === "Spender" ? "💸" : "⚖️"}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground block">Txns</span>
                    <span className="font-semibold text-foreground block mt-0.5">{user.totalTransactions}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Spent</span>
                    <p className="font-semibold text-foreground">{formatCurrency(user.totalSpent)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Savings</span>
                    <p className="font-semibold text-emerald-500">{user.savingsRate}%</p>
                  </div>
                </div>

                <div className="flex gap-1.5 mt-3 pt-3 border-t border-border/50">
                  {user.status !== "active" ? (
                    <button onClick={(e) => { e.stopPropagation(); handleStatusChange(user.id, "active"); }}
                      className="flex-1 text-xs py-1.5 rounded-lg bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 font-medium transition-colors"
                      title="Activate">
                      <UserCheck size={12} className="inline mr-1" /> Activate
                    </button>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); handleStatusChange(user.id, "suspended"); }}
                      className="flex-1 text-xs py-1.5 rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 font-medium transition-colors"
                      title="Suspend">
                      <UserX size={12} className="inline mr-1" /> Suspend
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Users size={32} className="mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground text-xs">No users found</p>
            </div>
          )}
        </div>

        {/* User detail panel */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 w-72 rounded-2xl border border-border shadow-2xl z-50 overflow-hidden hidden md:block"
              style={{ background: "var(--card)" }}
            >
              <div className="p-4 border-b border-border flex items-center justify-between"
                style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.1),rgba(79,70,229,0.1))" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                    {selectedUser.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{selectedUser.name}</p>
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", PERSONALITY_COLORS[selectedUser.personality])}>
                      {selectedUser.personality}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { label: "Email", value: selectedUser.email },
                  { label: "Monthly Income", value: formatCurrency(selectedUser.monthlyIncome) },
                  { label: "Total Spent", value: formatCurrency(selectedUser.totalSpent) },
                  { label: "Transactions", value: selectedUser.totalTransactions },
                  { label: "Savings Rate", value: `${selectedUser.savingsRate}%` },
                  { label: "Last Active", value: selectedUser.lastActive },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedUser.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => { handleStatusChange(selectedUser.id, selectedUser.status === "active" ? "suspended" : "active"); setSelectedUser(null); }}
                    className={cn("flex-1 text-xs py-2 rounded-lg font-medium transition-colors",
                      selectedUser.status === "active"
                        ? "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
                        : "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25"
                    )}>
                    {selectedUser.status === "active" ? "Suspend" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedUser.id)}
                    className="flex-1 text-xs py-2 rounded-lg font-medium bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AdminLayout>
  );
}
