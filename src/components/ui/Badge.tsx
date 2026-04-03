import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "income" | "expense" | "warning" | "success" | "info" | "purple";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-secondary text-secondary-foreground",
  income: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20",
  expense: "bg-rose-500/15 text-rose-400 border border-rose-500/20",
  warning: "bg-amber-500/15 text-amber-500 border border-amber-500/20",
  success: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20",
  info: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  purple: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
};

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
