"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import { EXPERIENCE_LEVELS } from "../data/teachingData";

interface ExperienceSelectorProps {
  className?: string;
}

export function ExperienceSelector({ className }: ExperienceSelectorProps) {
  const [selectedExperience, setSelectedExperience] = useState<string>("intermediate");

  return (
    <div className={`space-y-3 ${className || ""}`}>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
          Teaching & Mentoring Experience
        </label>
        <p className="text-xs text-muted-foreground mt-0.5">
          How long have you been teaching, mentoring, or creating instructional content?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EXPERIENCE_LEVELS.map((level) => {
          const isSelected = selectedExperience === level.id;
          return (
            <div
              key={level.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedExperience(level.id)}
              className={cn(
                "relative flex flex-col gap-1 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none",
                isSelected
                  ? "border-primary bg-accent/50 shadow-sm"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">
                  {level.label}
                </span>
                <span
                  className={cn(
                    "flex size-4.5 items-center justify-center rounded-full border transition-all",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background"
                  )}
                >
                  {isSelected && <Check className="size-3 stroke-3" />}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {level.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
