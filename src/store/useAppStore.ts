"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole, Theme, OnboardingData, Category } from "@/types";

interface AppState {
  role: UserRole;
  theme: Theme;
  onboarding: OnboardingData;
  isOnboardingComplete: boolean;
  isSidebarOpen: boolean;

  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  updateOnboarding: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const DEFAULT_ONBOARDING: OnboardingData = {
  fullName: "",
  age: "",
  email: "",
  phone: "",
  monthlyIncome: 0,
  savingsGoal: 0,
  selectedCategories: [],
  budgets: {} as Record<Category, number>,
  completed: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      role: "user",
      theme: "dark",
      onboarding: DEFAULT_ONBOARDING,
      isOnboardingComplete: false,
      isSidebarOpen: false,

      setRole: (role) => set({ role }),
      toggleRole: () => set((s) => ({ role: s.role === "admin" ? "user" : "admin" })),

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },

      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        get().setTheme(next);
      },

      updateOnboarding: (data) => {
        set((s) => ({ onboarding: { ...s.onboarding, ...data } }));
      },

      completeOnboarding: () => {
        set((s) => ({
          onboarding: { ...s.onboarding, completed: true },
          isOnboardingComplete: true,
        }));
      },

      resetOnboarding: () => {
        set({ onboarding: DEFAULT_ONBOARDING, isOnboardingComplete: false });
      },

      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    }),
    {
      name: "fintech-app",
    }
  )
);
