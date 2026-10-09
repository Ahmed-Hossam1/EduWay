"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TEACHING_LANGUAGES } from "../data/teachingData";

interface LanguagesSelectorProps {
  className?: string;
}

export function LanguagesSelector({ className }: LanguagesSelectorProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "English",
    "Arabic",
  ]);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
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
    </div>
  );
}
