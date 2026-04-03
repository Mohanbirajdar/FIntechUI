"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/store/useAdminStore";
import { useAppStore } from "@/store/useAppStore";
import { Toaster } from "sonner";
import {
  LayoutDashboard, Users, BarChart3, ArrowUpDown, Tag,
  FileText, Bell, Shield, LogOut, Sun, Moon, Menu, X,
  TrendingUp, Settings, ChevronRight, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard", badge: null },
  { icon: Users, label: "Users", href: "/admin/users", badge: null },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics", badge: null },
  { icon: ArrowUpDown, label: "Transactions", href: "/admin/transactions", badge: null },
  { icon: Tag, label: "Categories", href: "/admin/categories", badge: null },
  { icon: TrendingUp, label: "Spending Analysis", href: "/admin/spending", badge: null },
  { icon: FileText, label: "Reports", href: "/admin/reports", badge: null },
  { icon: Bell, label: "Notifications", href: "/admin/notifications", badge: "3" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdminAuthenticated, adminLogout, initialize } = useAdminStore();
  const { theme, toggleTheme, setTheme } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setTheme(theme);
    initialize();
    if (!isAdminAuthenticated) router.replace("/admin/login");
  }, [isAdminAuthenticated, router, theme, setTheme, initialize]);

  if (!isAdminAuthenticated) return null;

  const handleLogout = () => {
    adminLogout();
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Toaster position="top-right" toastOptions={{
        style: { background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }
      }} />

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex-shrink-0 border-r border-border flex flex-col h-screen sticky top-0 z-40 overflow-hidden"
        style={{ background: "var(--card)" }}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-border">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
            <Shield size={18} className="text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                <p className="font-bold text-foreground text-sm leading-none">FinTrack</p>
                <p className="text-[10px] text-amber-400 font-semibold leading-none mt-0.5">ADMIN PANEL</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.button
                key={item.href}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(item.href)}
                title={!sidebarOpen ? item.label : undefined}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group",
                  isActive
                    ? "text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                style={isActive ? { background: "linear-gradient(135deg,#f59e0b,#d97706)" } : {}}
              >
                <item.icon size={17} className="shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="text-sm font-medium flex-1 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {sidebarOpen && item.badge && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
                {sidebarOpen && !isActive && (
                  <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="p-2 border-t border-border space-y-1">
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
          >
            {theme === "dark" ? <Sun size={17} className="shrink-0" /> : <Moon size={17} className="shrink-0" />}
            {sidebarOpen && <span className="text-sm font-medium">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </button>
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={17} className="shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3 border-b border-border"
          style={{ background: "var(--card)", backdropFilter: "blur(12px)" }}>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">
              {navItems.find((n) => n.href === pathname)?.label || "Admin Panel"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
              <Zap size={11} />
              <span>Admin Mode</span>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
              A
            </div>
          </div>
        </div>

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6 max-w-screen-2xl"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
