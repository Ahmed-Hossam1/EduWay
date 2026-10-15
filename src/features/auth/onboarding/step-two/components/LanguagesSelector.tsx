"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useController } from "react-hook-form";
import { TEACHING_LANGUAGES } from "../data/teachingData";
import { OnboardingFormValues } from "../../schemas/onboardingSchema";
import { FieldError } from "../../components/FieldError";

interface LanguagesSelectorProps {
  className?: string;
}

export function LanguagesSelector({ className }: LanguagesSelectorProps) {
  // field.value = the chosen languages (string[])
  const { field, fieldState } = useController<OnboardingFormValues, "teachingLanguages">({ name: "teachingLanguages" });
  const selectedLanguages = field.value;

  // click → add it, click again → remove it
  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      field.onChange(selectedLanguages.filter((l) => l !== lang));
    } else {
      field.onChange([...selectedLanguages, lang]);
    }
  };

  return (
    <div className={`space-y-2.5 ${className || ""}`}>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
          Instruction Languages
        </label>
        <p className="text-xs text-muted-foreground mt-0.5">
          Which languages will you use to conduct your lectures and courses?
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TEACHING_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguages.includes(lang);
          return (
            <Button
              key={lang}
              type="button"
              size="sm"
              rounded="lg"
              variant={isSelected ? "default" : "outline"}
              onClick={() => toggleLanguage(lang)}
              aria-pressed={isSelected}
              className={cn(
                "gap-1.5 px-3.5 text-xs",
                !isSelected && "text-muted-foreground hover:border-primary/40"
              )}
            >
              {isSelected && <Check className="size-3.5 stroke-3" />}
              <span>{lang}</span>
            </Button>
          );
        })}
      </div>

      <FieldError message={fieldState.error?.message} />
    </div>
  );
}
