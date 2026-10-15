import Link from "next/link";
import { Check, Clock, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { OnboardingHeader } from "./OnboardingHeader";

// What happens after the onboarding (done / now / next)
const REVIEW_STEPS = [
  { icon: Check, title: "Profile submitted", description: "We received your teacher profile.", state: "done" },
  { icon: Clock, title: "Review by our team", description: "Usually takes 24–48 hours.", state: "current" },
  { icon: Rocket, title: "Start teaching", description: "Create your first course from your dashboard.", state: "next" },
] as const;

// /account/waiting — the teacher finished the onboarding, an admin must approve him
export function OnboardingWaiting({ firstName }: { firstName: string }) {
  return (
    <main className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <OnboardingHeader />

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <Card className="w-full max-w-lg rounded-2xl border-border bg-card p-6 text-center shadow-xl shadow-primary/5 sm:p-9 ring-0">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <Clock className="size-8" />
          </div>

          <h1 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">
            Thanks{firstName ? `, ${firstName}` : ""}! Your profile is under review
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Our team checks every instructor before publishing. We&apos;ll let you know as soon as your profile is approved.
          </p>

          {/* Timeline */}
          <ol className="mt-7 space-y-4 text-left">
            {REVIEW_STEPS.map((step) => (
              <li key={step.title} className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border",
                    step.state === "done" && "border-primary bg-primary text-primary-foreground",
                    step.state === "current" && "border-primary bg-accent text-primary",
                    step.state === "next" && "border-border bg-muted text-muted-foreground"
                  )}
                >
                  <step.icon className="size-4" />
                </span>
                <div>
                  <p className={cn("text-sm font-semibold", step.state === "next" ? "text-muted-foreground" : "text-foreground")}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row">
            <Button rounded="xl" className="h-11 w-full sm:flex-1" nativeButton={false} render={<Link href="/courses" />}>
              Browse courses
            </Button>
            <Button variant="outline" rounded="xl" className="h-11 w-full sm:flex-1" nativeButton={false} render={<Link href="/" />}>
              Back to home
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
