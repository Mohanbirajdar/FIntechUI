"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAdminStore } from "@/store/useAdminStore";
import { useAppStore } from "@/store/useAppStore";
import { Shield, Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Toaster } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin, isAdminAuthenticated, initialize } = useAdminStore();
  const { theme, setTheme } = useAppStore();
  const [email, setEmail] = useState("admin@fintrack.com");
  const [password, setPassword] = useState("admin123");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setTheme(theme);
    initialize();
    if (isAdminAuthenticated) router.replace("/admin/dashboard");
  }, [isAdminAuthenticated, router, theme, setTheme, initialize]);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter credentials"); return; }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1200));
    const ok = adminLogin(email, password);
    setLoading(false);
    if (ok) {
      toast.success("Welcome back, Admin!");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials. Try: admin@fintrack.com / admin123");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-right" />
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: "rgba(245,158,11,0.1)" }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: "rgba(124,58,237,0.1)" }} />
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(124,58,237,0.1) 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/onboarding")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Back to selection
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="glass-card rounded-3xl p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl"
              style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
            >
              <Shield size={32} className="text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to access the admin dashboard</p>

            {/* Credentials hint */}
            <div className="mt-3 px-4 py-2 rounded-xl border text-xs text-center" style={{ background: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.2)" }}>
              <span style={{ color: "#f59e0b" }}>Demo credentials:</span>
              <span className="text-muted-foreground"> admin@fintrack.com / admin123</span>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@fintrack.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              icon={<Mail size={14} />}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock size={14} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full h-11 rounded-xl border border-border bg-background pl-9 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <Button
              onClick={handleLogin}
              loading={loading}
              className="w-full h-11 text-sm font-semibold"
              style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" } as React.CSSProperties}
            >
              {loading ? "Authenticating..." : "Sign In to Admin Portal"}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Not an admin?{" "}
            <button onClick={() => router.push("/onboarding")} className="text-violet-400 hover:text-violet-300 transition-colors">
              Go back
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
