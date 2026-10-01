"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

interface VerificationSectionProps {
  className?: string;
}

export function VerificationSection({ className }: VerificationSectionProps) {
  const [isChecked, setIsChecked] = useState(true);

  return (
    <div className={`space-y-3 ${className || ""}`}>
      <div className="rounded-xl border border-border bg-card/60 p-4 transition-all hover:border-primary/30">
        <div className="flex items-start gap-3">
          <div className="pt-0.5">
            <Checkbox
              id="confirm-accuracy"
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(!!checked)}
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="confirm-accuracy"
              className="text-sm font-semibold text-foreground cursor-pointer select-none"
            >
              I confirm that my information is accurate
            </label>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By confirming, you certify that all submitted teaching experience, credentials, and profile links are true and belong to you.
            </p>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-border/40 flex items-center gap-2 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary shrink-0" />
          <span>
            EduWay verifies instructor profiles within 24–48 hours before public publishing.
          </span>
        </div>
      </div>
    </div>
  );
}
