"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck } from "lucide-react";
import { useController } from "react-hook-form";
import { OnboardingFormValues } from "../../schemas/onboardingSchema";
import { FieldError } from "../../components/FieldError";

interface VerificationSectionProps {
    className?: string;
}

export function VerificationSection({ className }: VerificationSectionProps) {
    // field.value = true / false (starts unchecked: he must check it himself)
    const { field, fieldState } = useController<OnboardingFormValues, "confirmed">({ name: "confirmed" });

    return (
        <div className={`space-y-3 ${className || ""}`}>
            <div className="rounded-xl border border-border bg-card/60 p-4 transition-all hover:border-primary/30">
                <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                        <Checkbox
                            id="confirm-accuracy"
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(!!checked)}
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
                            By confirming, you certify that all submitted teaching experience, credentials, and profile
                            links are true and belong to you.
                        </p>
                    </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-border/40 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <ShieldCheck className="size-3.5 text-primary shrink-0" />
                    <span>EduWay verifies instructor profiles within 24–48 hours before public publishing.</span>
                </div>
            </div>

            <FieldError message={fieldState.error?.message} />
        </div>
    );
}
