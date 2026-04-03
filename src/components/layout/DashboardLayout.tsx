"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FloatingNavbar } from "./FloatingNavbar";
import { useAppStore } from "@/store/useAppStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { Toaster } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme, setTheme } = useAppStore();
  const { initializeMockData } = useTransactionStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setTheme(theme);
  }, [theme, setTheme]);

  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          },
        }}
      />

      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl"
          animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-60 -left-60 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl"
          animate={{ y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/3 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <FloatingNavbar />

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 pb-32 pt-4 px-4 max-w-7xl mx-auto"
      >
        {children}
      </motion.main>
    </div>
  );
}
