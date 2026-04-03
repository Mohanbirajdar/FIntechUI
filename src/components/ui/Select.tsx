"use client";
import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className, children, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className="relative">
        <select
          className={cn(
            "w-full h-11 rounded-xl border border-border bg-background px-3 py-2 pr-9 text-sm text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
            "appearance-none transition-all duration-200 cursor-pointer",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-destructive",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
