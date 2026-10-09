"use client";

import Input from "@/components/ui/input";
import { socialLinksFields } from "../data/socialLinksData";

interface SocialLinksSectionProps {
  className?: string;
}

export function SocialLinksSection({ className }: SocialLinksSectionProps) {
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
              name={field.name}
              label={field.label}
              placeholder={field.placeholder}
              helperText={field.helperText}
              fullWidth
              leftIcon={Icon ? (
                <Icon
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              ) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
