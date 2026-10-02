"use client";

import Input from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";
import { stepOnePersonalFields } from "../data/stepOneInputs";

interface TeacherStepOneFormProps {
  onContinue?: () => void;
  className?: string;
}

export function TeacherStepOneForm({
  onContinue,
  className,
}: TeacherStepOneFormProps) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`flex flex-col gap-6 ${className || ""}`}
    >
      {/* ── Personal Information (Data-Driven Repeated Inputs) ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stepOnePersonalFields.map((field) => {
          const Icon = field.icon;
          return (
            <Input
              key={field.name}
              id={field.id}
              name={field.name}
              label={field.label}
              placeholder={field.placeholder}
              type={field.type}
              helperText={field.helperText}
              fullWidth
              leftIcon={
                Icon ? (
                  <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                ) : undefined
              }
            />
          );
        })}
      </div>

      {/* ── Professional Title ── */}
      <Input
        id="teacher-onboarding-title"
        name="professionalTitle"
        label="Professional Title"
        placeholder="e.g. Senior Frontend Developer"
        helperText="Your headline or current job title shown on course pages"
        fullWidth
        leftIcon={
          <Briefcase className="size-4 text-muted-foreground" aria-hidden="true" />
        }
      />

      {/* ── Short Bio (shadcn Textarea) ── */}
      <Textarea
        id="teacher-onboarding-bio"
        name="bio"
        label="Short Bio"
        placeholder="Introduce yourself to prospective students. Share your background, what you love about teaching, and what students will gain from your courses..."
        helperText="Provide a brief summary of your expertise (recommended: 2-4 sentences)."
        rows={4}
      />

      {/* ── Action Button (Visual only) ── */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          type="button"
          size="lg"
          onClick={onContinue}
          className="w-full rounded-xl text-base font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
        >
          <span>Continue to Teaching Information</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Step 1 of 3 — You will be able to edit your profile information at any time.
        </p>
      </div>
    </form>
  );
}
