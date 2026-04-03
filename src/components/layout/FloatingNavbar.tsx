"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ArrowUpDown, Plus, TrendingUp, User, Sun, Moon } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AddTransactionModal } from "@/components/transactions/AddTransactionModal";

const navItems = [
  { icon: LayoutDashboard, label: "Home",         href: "/dashboard" },
  { icon: ArrowUpDown,     label: "Transactions", href: "/transactions" },
  { icon: Plus,            label: "Add",          href: "#add", special: true },
  { icon: TrendingUp,      label: "Insights",     href: "/insights" },
  { icon: User,            label: "Profile",      href: "/profile" },
];

export function FloatingNavbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { theme, toggleTheme } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <AddTransactionModal open={showAdd} onClose={() => setShowAdd(false)} />

      {/* Theme toggle — top right only */}
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 320, damping: 22 }}
        className="fixed top-4 right-4 z-40"
      >
        <motion.button
          whileTap={{ scale: 0.88, rotate: 15 }}
          whileHover={{ scale: 1.08 }}
          onClick={toggleTheme}
          className="h-10 w-10 rounded-2xl navbar-glass flex items-center justify-center text-foreground shadow-lg"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0,    opacity: 1, scale: 1 }}
              exit ={{ rotate:  180,  opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Floating bottom navbar */}
      <motion.nav
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 280, damping: 24 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="navbar-glass rounded-2xl px-2 py-2 flex items-center gap-1 shadow-2xl">
          {navItems.map((item) => {
            const isActive = item.href !== "#add" && pathname === item.href;
            const isAdd    = !!item.special;

            return (
              <motion.button
                key={item.href}
                whileTap={{ scale: 0.87 }}
                whileHover={!isAdd ? { y: -2 } : { scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                onClick={() => { if (isAdd) setShowAdd(true); else router.push(item.href); }}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors duration-200",
                  isAdd
                    ? "gradient-primary text-white shadow-lg shadow-violet-500/40 px-5"
                    : isActive
                    ? "text-violet-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {/* Shared active pill */}
                {isActive && !isAdd && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 bg-violet-500/15 rounded-xl"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Icon with bounce on active */}
                <motion.div
                  animate={isActive ? { y: [0, -3, 0] } : { y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative z-10"
                >
                  <item.icon size={isAdd ? 20 : 18} />
                </motion.div>

                <span className="text-[10px] font-medium relative z-10 leading-none">
                  {item.label}
                </span>

                {/* Active dot */}
                {isActive && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-violet-400"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
