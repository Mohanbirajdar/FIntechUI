"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default function OnboardingPage() {
  const { isOnboardingComplete, theme, setTheme } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setTheme(theme);
    if (isOnboardingComplete) {
      router.replace("/dashboard");
    }
  }, [isOnboardingComplete, router, theme, setTheme]);

  if (isOnboardingComplete) return null;

  return <OnboardingFlow />;
}
