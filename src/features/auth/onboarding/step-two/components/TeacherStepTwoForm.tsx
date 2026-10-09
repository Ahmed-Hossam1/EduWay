"use client";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import { CategorySelector } from "./CategorySelector";
import { CertificationsSection } from "./CertificationsSection";
import { ExperienceSelector } from "./ExperienceSelector";
import { LanguagesSelector } from "./LanguagesSelector";
import { SkillsSelector } from "./SkillsSelector";

interface TeacherStepTwoFormProps {
  onBack?: () => void;
  onContinue?: () => void;
  className?: string;
}

export function TeacherStepTwoForm({
  onBack,
  onContinue,
  className,
}: TeacherStepTwoFormProps) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`flex flex-col gap-8 ${className || ""}`}
    >
      {/* ── Section 1: Primary Category ── */}
      <CategorySelector />

      {/* ── Section 2: Skills & Topics ── */}
      <SkillsSelector />

      {/* ── Section 3: Teaching Experience ── */}
      <ExperienceSelector />

      {/* ── Section 4: Professional Background / Affiliations ── */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
            Current or Past Affiliation
          </label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your current company, university, or academy (optional).
          </p>
        </div>

        <Input
          id="teacher-affiliation"
          name="affiliation"
          placeholder="e.g. Google, Harvard University, or Freelance Instructor"
          fullWidth
          leftIcon={<Building2 className="size-4 text-muted-foreground" />}
          helperText="Displayed alongside your profile to showcase real-world industry background"
        />
      </div>

      {/* ── Section 5: Certifications ── */}
      <CertificationsSection />

      {/* ── Section 6: Instruction Languages ── */}
      <LanguagesSelector />

      {/* ── Section 7: Action Navigation Buttons ── */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          rounded="xl" className="w-full sm:w-auto text-sm font-semibold gap-2 border-border hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
          <span>Back to About You</span>
        </Button>

        <Button
          type="button"
          size="lg"
          onClick={onContinue}
          rounded="xl" className="w-full sm:w-auto text-base font-semibold gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
        >
          <span>Continue to Verification</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Step 2 of 3 — You can update your teaching subjects and skills at any point from your instructor dashboard.
      </p>
    </form>
  );
}
