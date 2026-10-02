"use client";

import { Logo } from "@/components/shared/Logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Sparkles } from "lucide-react";

export function OnboardingHeader() {
  return (
    <header className="flex w-full items-center justify-between px-6 py-5 sm:px-10 lg:px-16 border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Logo />
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
          <Sparkles className="size-3" aria-hidden="true" />
          Teacher Onboarding
        </span>
      </div>

      <div className="flex items-center gap-3">
        <AnimatedThemeToggler
          variant="circle"
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Toggle theme"
        />
      </div>
    </header>
  );
}
