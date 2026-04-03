"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isOnboardingComplete, theme, setTheme } = useAppStore();

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.classList.toggle("dark", theme === "dark");
    setTheme(theme);

    const timer = setTimeout(() => {
      if (isOnboardingComplete) {
        router.replace("/dashboard");
      } else {
        router.replace("/onboarding");
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isOnboardingComplete, router, theme, setTheme]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex flex-col items-center gap-4 relative z-10"
      >
        <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/30">
          <Wallet size={40} className="text-white" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-foreground">FinTrack</h1>
          <p className="text-muted-foreground text-sm mt-1">Loading your finances...</p>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="w-32 h-1 gradient-primary rounded-full"
        />
      </motion.div>
    </div>
  );
}
