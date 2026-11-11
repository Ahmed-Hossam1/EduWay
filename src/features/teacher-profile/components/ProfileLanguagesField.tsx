"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useController } from "react-hook-form";
import { TEACHING_LANGUAGES } from "@/features/auth/onboarding/step-two/data/teachingData";
import { TeacherProfileValues } from "../schemas/teacherProfileSchema";

export function ProfileLanguagesField() {
    const { field, fieldState } = useController<TeacherProfileValues, "teachingLanguages">({
        name: "teachingLanguages",
    });
    const selectedLanguages = field.value;

    const toggleLanguage = (lang: string) => {
        if (selectedLanguages.includes(lang)) {
            field.onChange(selectedLanguages.filter((l) => l !== lang));
        } else {
            field.onChange([...selectedLanguages, lang]);
        }
    };

    return (
        <div className="space-y-2.5">
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
                                !isSelected && "text-muted-foreground hover:border-primary/40",
                            )}
                        >
                            {isSelected && <Check className="size-3.5 stroke-3" />}
                            <span>{lang}</span>
                        </Button>
                    );
                })}
            </div>

            {fieldState.error?.message && (
                <p className="text-xs text-destructive">{fieldState.error.message}</p>
            )}
        </div>
    );
}
