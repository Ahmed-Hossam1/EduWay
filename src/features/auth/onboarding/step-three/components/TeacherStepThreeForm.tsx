"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";
import { SocialLinksSection } from "./SocialLinksSection";
import { VerificationSection } from "./VerificationSection";

interface TeacherStepThreeFormProps {
  onBack?: () => void;
  onFinish?: () => void;
  className?: string;
}

export function TeacherStepThreeForm({
  onBack,
  onFinish,
  className,
}: TeacherStepThreeFormProps) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`flex flex-col gap-8 ${className || ""}`}
    >
      {/* ── Section 1: Profile Photo ── */}
      <ProfilePhotoUpload />

      {/* ── Section 2: Social / Professional Links (Data-Driven) ── */}
      <SocialLinksSection />

      {/* ── Section 3: Verification & Accuracy Confirmation ── */}
      <VerificationSection />

      {/* ── Section 4: Action Navigation Buttons ── */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          rounded="xl" className="w-full sm:w-auto text-sm font-semibold gap-2 border-border hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Teaching Information</span>
        </Button>

        <Button
          type="button"
          size="lg"
          onClick={onFinish}
          rounded="xl" className="w-full sm:w-auto text-base font-semibold gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
        >
          <Sparkles className="size-4" />
          <span>Finish</span>
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Step 3 of 3 — Upon finishing, your instructor profile will be submitted for verification.
      </p>
    </form>
  );
}
