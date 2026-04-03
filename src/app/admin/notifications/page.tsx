"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminStore } from "@/store/useAdminStore";
import { AdminNotification } from "@/lib/adminMockData";
import { Bell, Send, Trash2, Info, AlertTriangle, CheckCircle, XCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

const TYPE_CONFIG: Record<AdminNotification["type"], { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  info: { icon: <Info size={14} />, color: "text-blue-400", bg: "bg-blue-500/10", label: "Info" },
  warning: { icon: <AlertTriangle size={14} />, color: "text-amber-400", bg: "bg-amber-500/10", label: "Warning" },
  success: { icon: <CheckCircle size={14} />, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Success" },
  error: { icon: <XCircle size={14} />, color: "text-rose-400", bg: "bg-rose-500/10", label: "Error" },
};

export default function NotificationsPage() {
  const { notifications, addNotification, deleteNotification, users } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "info" as AdminNotification["type"] });

  const handleSend = async () => {
    if (!form.title.trim() || !form.message.trim()) { toast.error("Fill in all fields"); return; }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    addNotification({ title: form.title, message: form.message, type: form.type });
    setSending(false);
    setShowModal(false);
    setForm({ title: "", message: "", type: "info" });
    toast.success(`Notification sent to ${users.length} users!`);
  };

  const templates = [
    { title: "Maintenance Alert", message: "Scheduled maintenance tonight 11 PM - 1 AM. Save your work.", type: "warning" as const },
    { title: "New Feature!", message: "Check out our new AI-powered budget recommendations!", type: "info" as const },
    { title: "Security Notice", message: "Please review your account security settings.", type: "error" as const },
    { title: "Milestone Achieved", message: "Congrats! Platform users saved ₹1 Crore this month!", type: "success" as const },
  ];

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notification Center</h1>
            <p className="text-sm text-muted-foreground">Broadcast messages to {users.length} platform users</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={14} /> New Notification
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Sent", value: notifications.length, color: "text-violet-400" },
            { label: "Avg Read Rate", value: `${notifications.length > 0 ? Math.round(notifications.reduce((s, n) => s + (n.readCount / Math.max(n.totalUsers, 1)), 0) / notifications.length * 100) : 0}%`, color: "text-emerald-500" },
            { label: "Total Users", value: users.length, color: "text-amber-400" },
            { label: "Unread (avg)", value: notifications.length > 0 ? Math.round(notifications.reduce((s, n) => s + (n.totalUsers - n.readCount), 0) / notifications.length) : 0, color: "text-blue-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border p-4 text-center" style={{ background: "var(--card)" }}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Templates */}
        <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Quick Templates</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {templates.map((t) => {
              const cfg = TYPE_CONFIG[t.type];
              return (
                <motion.button
                  key={t.title}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setForm({ title: t.title, message: t.message, type: t.type }); setShowModal(true); }}
                  className="p-3 rounded-xl border border-border text-left hover:border-violet-500/30 transition-colors"
                >
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center mb-2", cfg.bg, cfg.color)}>
                    {cfg.icon}
                  </div>
                  <p className="text-xs font-semibold text-foreground">{t.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{t.message}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Notification list */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Sent Notifications</h3>
          <AnimatePresence initial={false}>
            {notifications.map((n, i) => {
              const cfg = TYPE_CONFIG[n.type];
              const readPct = Math.round((n.readCount / Math.max(n.totalUsers, 1)) * 100);
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl border border-border p-4 group hover:border-violet-500/20 transition-colors"
                  style={{ background: "var(--card)" }}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", cfg.bg, cfg.color)}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                        </div>
                        <button
                          onClick={() => { deleteNotification(n.id); toast.success("Deleted"); }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-500/15 text-muted-foreground hover:text-rose-400 transition-all shrink-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", cfg.bg, cfg.color)}>
                          {cfg.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{new Date(n.sentAt).toLocaleString("en-IN")}</span>
                        <div className="flex items-center gap-2 ml-auto">
                          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${readPct}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground">{readPct}% read ({n.readCount}/{n.totalUsers})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {notifications.length === 0 && (
            <div className="py-16 text-center">
              <Bell size={40} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No notifications sent yet</p>
            </div>
          )}
        </div>

        {/* Compose Modal */}
        <Modal open={showModal} onClose={() => setShowModal(false)} title="Send Notification">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Type</label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(TYPE_CONFIG) as AdminNotification["type"][]).map((t) => {
                  const cfg = TYPE_CONFIG[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className={cn("flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all",
                        form.type === t ? "border-violet-500 bg-violet-500/10" : "border-border hover:border-violet-500/40"
                      )}
                    >
                      <span className={cn(cfg.color)}>{cfg.icon}</span>
                      <span className="text-[10px] font-medium text-foreground">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Input label="Title" placeholder="Notification title" value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Message</label>
              <textarea
                className="w-full min-h-[80px] rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                placeholder="Write your message..."
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl text-xs"
              style={{ background: "rgba(139,92,246,0.08)", color: "var(--muted-foreground)" }}>
              <Bell size={12} className="text-violet-400 shrink-0" />
              This notification will be sent to <strong className="text-foreground mx-1">{users.length} users</strong>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSend} loading={sending} className="flex-1">
                <Send size={12} /> {sending ? "Sending..." : "Send Notification"}
              </Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </AdminLayout>
  );
}
