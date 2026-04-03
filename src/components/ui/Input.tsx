"use client";
import { forwardRef, InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  prefix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconRight, prefix, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
              {icon}
            </div>
          )}
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm z-10">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full h-11 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-10",
              prefix && "pl-8",
              iconRight && "pr-10",
              error && "border-destructive focus:ring-destructive/30",
              className
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {iconRight}
            </div>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-destructive"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";

export function Textarea({
  label,
  error,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <textarea
        className={cn(
          "w-full min-h-[80px] rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground",
          "placeholder:text-muted-foreground resize-none",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
          "transition-all duration-200",
          error && "border-destructive",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
