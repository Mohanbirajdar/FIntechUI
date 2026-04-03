"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminStore } from "@/store/useAdminStore";
import { MockCategory } from "@/lib/adminMockData";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRESET_COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#ec4899", "#06b6d4", "#f97316", "#a855f7", "#22c55e"];
const PRESET_ICONS = ["🍕", "🚗", "🛍️", "🎬", "⚡", "🏥", "✈️", "📚", "💼", "💻", "📈", "💰", "🏠", "🎮", "🏋️", "🎵", "🍺", "💄", "🚀", "🌍"];

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState<MockCategory | null>(null);
  const [form, setForm] = useState({ name: "", icon: "💰", color: "#8b5cf6" });

  const openAdd = () => { setEditCat(null); setForm({ name: "", icon: "💰", color: "#8b5cf6" }); setShowModal(true); };
  const openEdit = (c: MockCategory) => { setEditCat(c); setForm({ name: c.name, icon: c.icon, color: c.color }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    if (editCat) {
      updateCategory(editCat.id, { name: form.name, icon: form.icon, color: form.color });
      toast.success("Category updated");
    } else {
      addCategory({ name: form.name, icon: form.icon, color: form.color });
      toast.success("Category added");
    }
    setShowModal(false);
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Category Management</h1>
            <p className="text-sm text-muted-foreground">{categories.length} categories</p>
          </div>
          <Button onClick={openAdd}><Plus size={14} /> Add Category</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence initial={false}>
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-border p-4 group relative overflow-hidden"
                style={{ background: "var(--card)" }}
              >
                {/* Color accent */}
                <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl" style={{ background: cat.color }} />

                <div className="flex items-start justify-between mt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: `${cat.color}20` }}>
                      {cat.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{cat.name}</p>
                      <p className="text-[10px] text-muted-foreground">{cat.transactionCount} transactions</p>
                    </div>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(cat)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-all">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => { if (confirm("Delete?")) { deleteCategory(cat.id); toast.success("Deleted"); } }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-rose-500/15 text-muted-foreground hover:text-rose-400 transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold text-foreground">{formatCurrency(cat.totalAmount)}</span>
                  </div>
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((cat.totalAmount / 500000) * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: i * 0.03 }}
                      className="h-full rounded-full"
                      style={{ background: cat.color }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Modal open={showModal} onClose={() => setShowModal(false)} title={editCat ? "Edit Category" : "Add Category"}>
          <div className="space-y-4">
            {/* Preview */}
            <div className="flex items-center justify-center py-2">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border"
                style={{ background: `${form.color}10` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `${form.color}20` }}>{form.icon}</div>
                <div>
                  <p className="font-bold text-foreground">{form.name || "Category Name"}</p>
                  <p className="text-xs text-muted-foreground">Preview</p>
                </div>
              </div>
            </div>

            <Input label="Name" placeholder="e.g. Fitness" value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Icon</label>
              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto no-scrollbar">
                {PRESET_ICONS.map((ico) => (
                  <button key={ico} onClick={() => setForm((f) => ({ ...f, icon: ico }))}
                    className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all border",
                      form.icon === ico ? "border-violet-500 bg-violet-500/15" : "border-border hover:border-violet-500/40"
                    )}>
                    {ico}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((c) => (
                  <button key={c} onClick={() => setForm((f) => ({ ...f, color: c }))}
                    className={cn("w-8 h-8 rounded-xl transition-all", form.color === c ? "ring-2 ring-offset-2 ring-offset-background scale-110" : "hover:scale-110")}
                    style={{ background: c, outline: form.color === c ? `2px solid ${c}` : "none" }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} className="flex-1">{editCat ? "Update" : "Add"} Category</Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </AdminLayout>
  );
}
