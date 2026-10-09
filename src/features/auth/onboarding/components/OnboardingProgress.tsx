import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ONBOARDING_STEPS } from "../data/onboardingSteps";

interface OnboardingProgressProps {
  currentStep?: number;
  onStepClick?: (stepNumber: number) => void;
  className?: string;
}

export function OnboardingProgress({
  currentStep = 1,
  onStepClick,
  className,
}: OnboardingProgressProps) {
  const totalSteps = ONBOARDING_STEPS.length;

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Top summary row */}
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
        <span className="text-primary font-bold">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-muted-foreground">
          {Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)}% Complete
        </span>
      </div>

      {/* Steps visual track */}
      <div className="relative">
        {/* Background connecting bar */}
        <div
          aria-hidden="true"
          className="absolute top-4 left-6 right-6 -translate-y-1/2 h-0.5 bg-border"
        >
          {/* Active progress fill */}
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Step nodes */}
        <ol className="relative z-10 flex w-full justify-between">
          {ONBOARDING_STEPS.map((step) => {
            const isCompleted = step.stepNumber < currentStep;
            const isCurrent = step.stepNumber === currentStep;
            const isUpcoming = step.stepNumber > currentStep;
            const isClickable = onStepClick && step.stepNumber <= 3;

            return (
              <li
                key={step.stepNumber}
                className="flex flex-1 flex-col items-center text-center px-1"
              >
                {/* Node circle */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  rounded="full"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(step.stepNumber)}
                  className={cn(
                    "text-xs font-bold transition-all duration-300 ring-4 ring-background disabled:opacity-100",
                    isClickable ? "cursor-pointer" : "cursor-default",
                    isCompleted &&
                    "bg-primary text-primary-foreground shadow-sm hover:opacity-90",
                    isCurrent &&
                    "border-2 border-primary bg-background text-primary shadow-md shadow-primary/20 ring-primary/20",
                    isUpcoming &&
                    "border-2 border-border bg-card text-muted-foreground"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="size-4 stroke-3" aria-hidden="true" />
                  ) : (
                    <span className="flex items-center justify-center">
                      {isCurrent ? (
                        <span className="size-2.5 rounded-full bg-primary animate-pulse" />
                      ) : (
                        <span>{step.stepNumber}</span>
                      )}
                    </span>
                  )}
                </Button>

                {/* Step title & subtitle */}
                <div className="mt-2.5 flex flex-col items-center">
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-semibold transition-colors leading-tight",
                      isCurrent
                        ? "text-foreground font-bold"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                  <span className="hidden sm:block text-[11px] text-muted-foreground/80 mt-0.5">
                    {step.subtitle}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
