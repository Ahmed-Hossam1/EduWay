"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useController } from "react-hook-form";
import { POPULAR_SKILLS } from "../data/teachingData";
import { OnboardingFormValues } from "../../schemas/onboardingSchema";
import { FieldError } from "../../components/FieldError";

interface SkillsSelectorProps {
    className?: string;
}

export function SkillsSelector({ className }: SkillsSelectorProps) {
    // field.value = the chosen skills (string[]) — saved in the onboarding form
    const { field, fieldState } = useController<OnboardingFormValues, "skills">({ name: "skills" });
    const selectedSkills = field.value;

    // the text of the "Type a skill" input (not part of the form)
    const [customSkill, setCustomSkill] = useState("");

    const handleAddSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (trimmed && !selectedSkills.includes(trimmed)) {
            field.onChange([...selectedSkills, trimmed]);
            setCustomSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        field.onChange(selectedSkills.filter((s) => s !== skillToRemove));
    };

    return (
        <div className={`space-y-3 ${className || ""}`}>
            <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
                    Skills & Topics You Teach
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Select or add the key technologies, subjects, and tools you plan to teach.
                </p>
            </div>

            {/* Selected Skills Badges */}
            <div className="flex flex-wrap gap-2 min-h-10 items-center p-2.5 rounded-xl border border-border bg-background">
                {selectedSkills.length === 0 ? (
                    <span className="text-xs text-muted-foreground/70 px-1">
                        No skills selected yet. Choose from below or type your own.
                    </span>
                ) : (
                    selectedSkills.map((skill) => (
                        <Badge
                            key={skill}
                            variant="accent"
                            className="gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all"
                        >
                            <span>{skill}</span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                rounded="full"
                                onClick={() => handleRemoveSkill(skill)}
                                className="size-4 hover:bg-transparent hover:text-destructive"
                                aria-label={`Remove ${skill}`}
                            >
                                <X className="size-3" />
                            </Button>
                        </Badge>
                    ))
                )}
            </div>

            {/* Add Custom Skill Input */}
            <div className="flex gap-2">
                <div className="flex-1">
                    <Input
                        id="custom-skill-input"
                        placeholder="Type a skill (e.g. Python, Figma, GraphQL)"
                        value={customSkill}
                        maxLength={30}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        onKeyDown={(e) => {
                            // Enter adds the skill (and doesn't submit the form)
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddSkill(customSkill);
                            }
                        }}
                        fullWidth
                    />
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddSkill(customSkill)}
                    disabled={!customSkill.trim()}
                    rounded="lg"
                    className="gap-1.5 h-10 px-4"
                >
                    <Plus className="size-4" />
                    <span>Add</span>
                </Button>
            </div>

            <FieldError message={fieldState.error?.message} />

            {/* Suggested Quick-Pick Skills */}
            <div className="pt-1">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Popular Suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SKILLS.filter((s) => !selectedSkills.includes(s)).map((skill) => (
                        <Button
                            key={skill}
                            type="button"
                            variant="outline"
                            size="xs"
                            rounded="md"
                            onClick={() => handleAddSkill(skill)}
                            className="gap-1 bg-muted/50 px-2.5 text-muted-foreground hover:border-primary/40 hover:bg-accent/40"
                        >
                            <Plus className="size-3 text-muted-foreground" />
                            {skill}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
