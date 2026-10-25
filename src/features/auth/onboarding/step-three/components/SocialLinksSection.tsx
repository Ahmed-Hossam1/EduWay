"use client";

import { Input } from "@/components/ui/input";
import { useFormContext, useFormState } from "react-hook-form";
import { socialLinksFields } from "../data/socialLinksData";
import { OnboardingFormValues } from "../../schemas/onboardingSchema";

interface SocialLinksSectionProps {
    className?: string;
}

export function SocialLinksSection({ className }: SocialLinksSectionProps) {
    const { register } = useFormContext<OnboardingFormValues>();
    // useFormState (not formState from the context): this component listens to the errors itself,
    // so it re-renders when they change (needed with the React Compiler, which memoizes components)
    const { errors } = useFormState<OnboardingFormValues>();

    return (
        <div className={`space-y-4 ${className || ""}`}>
            <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
                    Professional Links & Socials
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Link your LinkedIn and personal website to verify your profile and showcase your credibility.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {socialLinksFields.map((field) => {
                    const Icon = field.icon;
                    return (
                        <Input
                            key={field.name}
                            id={field.id}
                            type={field.type}
                            {...register(field.name)}
                            label={field.label}
                            placeholder={field.placeholder}
                            helperText={field.helperText}
                            errorText={errors[field.name]?.message}
                            fullWidth
                            leftIcon={
                                Icon ? <Icon className="size-4 text-muted-foreground" aria-hidden="true" /> : undefined
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
}
