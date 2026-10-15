"use client";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Building2, GraduationCap } from "lucide-react";
import { useFormContext, useFormState } from "react-hook-form";
import { CategorySelector } from "./CategorySelector";
import { CertificationsSection } from "./CertificationsSection";
import { ExperienceSelector } from "./ExperienceSelector";
import { LanguagesSelector } from "./LanguagesSelector";
import { SkillsSelector } from "./SkillsSelector";
import { OnboardingFormValues } from "../../schemas/onboardingSchema";
import { CategoryOption } from "../../types";

interface TeacherStepTwoFormProps {
  categories: CategoryOption[];
  onBack?: () => void;
  className?: string;
}

// Step 2 · Teaching information. Part of the ONE onboarding <form> (TeacherOnboardingContainer).
export function TeacherStepTwoForm({
  categories,
  onBack,
  className,
}: TeacherStepTwoFormProps) {
  const { register } = useFormContext<OnboardingFormValues>();
  // useFormState (not formState from the context): this component listens to the errors itself,
  // so it re-renders when they change (needed with the React Compiler, which memoizes components)
  const { errors } = useFormState<OnboardingFormValues>();

  return (
    <div className={`flex flex-col gap-8 ${className || ""}`}>
      {/* ── Section 1: Primary Category ── */}
      <CategorySelector categories={categories} />

      {/* ── Section 2: Skills & Topics ── */}
      <SkillsSelector />

      {/* ── Section 3: Teaching Experience ── */}
      <ExperienceSelector />

      {/* ── Section 4: Professional Background (university + company) ── */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
            Professional Background
          </label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Where you studied and where you work (both optional).
          </p>
        </div>

        <Input
          id="teacher-university"
          {...register("university")}
          label="University"
          placeholder="e.g. Cairo University, Harvard University"
          fullWidth
          leftIcon={<GraduationCap className="size-4 text-muted-foreground" />}
          helperText="The university or academy you studied at"
          errorText={errors.university?.message}
        />

        <Input
          id="teacher-company"
          {...register("company")}
          label="Company"
          placeholder="e.g. Google, Vodafone, or Freelance"
          fullWidth
          leftIcon={<Building2 className="size-4 text-muted-foreground" />}
          helperText="Your current or last company — shows your real-world industry background"
          errorText={errors.company?.message}
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

        {/* submit → the container checks this step and moves to step 3 */}
        <Button
          type="submit"
          size="lg"
          rounded="xl" className="w-full sm:w-auto text-base font-semibold gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
        >
          <span>Continue to Verification</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Step 2 of 3 — You can update your teaching subjects and skills at any point from your instructor dashboard.
      </p>
    </div>
  );
}
