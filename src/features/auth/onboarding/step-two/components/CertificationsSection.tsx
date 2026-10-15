"use client";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Award, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext, useFormState } from "react-hook-form";
import { OnboardingFormValues } from "../../schemas/onboardingSchema";
import { FieldError } from "../../components/FieldError";

interface CertificationsSectionProps {
  className?: string;
}

export function CertificationsSection({ className }: CertificationsSectionProps) {
  const { register } = useFormContext<OnboardingFormValues>();
  // useFormState (not formState from the context): this component listens to the errors itself,
  // so it re-renders when they change (needed with the React Compiler, which memoizes components)
  const { errors } = useFormState<OnboardingFormValues>();

  // useFieldArray = a list inside the form: fields (to show), append (add), remove (delete)
  // field.id is a key made by react-hook-form (only for React's key=)
  const { fields, append, remove } = useFieldArray<OnboardingFormValues, "certifications">({ name: "certifications" });

  const handleAddCert = () => {
    append({ name: "", issuer: "", year: "" });
  };

  return (
    <div className={`space-y-3 ${className || ""}`}>
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
            Certifications & Accreditations (Optional)
          </label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add relevant industry licenses, certificates, or degrees to strengthen your credibility.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddCert}
          className="gap-1.5 text-xs h-8"
        >
          <Plus className="size-3.5" />
          <span>Add Certificate</span>
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-border bg-card/40 text-center">
          <Award className="size-8 text-muted-foreground/60 mb-2" />
          <p className="text-xs text-muted-foreground">
            No certifications added yet.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddCert}
            className="mt-2 text-xs text-primary hover:text-primary-hover gap-1"
          >
            <Plus className="size-3" />
            Add your first certification
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((cert, index) => {
            // the errors of THIS certificate (if any)
            const certErrors = errors.certifications?.[index];

            return (
              <div
                key={cert.id}
                className="relative p-3.5 rounded-xl border border-border bg-card/60 space-y-3 group"
              >
                <div className="flex items-center justify-between pb-1 border-b border-border/40">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Award className="size-3.5 text-primary" />
                    Certificate #{index + 1}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => remove(index)}
                    className="text-muted-foreground hover:text-destructive size-6"
                    aria-label="Remove certification"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <Input
                      placeholder="Certificate Name (e.g. Meta Frontend Certificate)"
                      aria-label="Certificate name"
                      {...register(`certifications.${index}.name`)}
                      errorText={certErrors?.name?.message}
                      fullWidth
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <Input
                      placeholder="Issuing Org (e.g. Meta / Coursera)"
                      aria-label="Issuing organization"
                      {...register(`certifications.${index}.issuer`)}
                      errorText={certErrors?.issuer?.message}
                      fullWidth
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      placeholder="Year"
                      aria-label="Year"
                      inputMode="numeric"
                      maxLength={4}
                      {...register(`certifications.${index}.year`)}
                      errorText={certErrors?.year?.message}
                      fullWidth
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* "You can add up to 10 certificates" */}
      <FieldError message={errors.certifications?.message} />
    </div>
  );
}
