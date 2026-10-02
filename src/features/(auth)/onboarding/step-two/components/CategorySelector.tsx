"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import { SUBJECT_CATEGORIES } from "../data/teachingData";

interface CategorySelectorProps {
  className?: string;
}

export function CategorySelector({ className }: CategorySelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("web-dev");

  return (
    <div className={`space-y-3 ${className || ""}`}>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
          Primary Teaching Category
        </label>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select your main domain. You can create courses in other categories later.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {SUBJECT_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <div
              key={category.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "group relative flex flex-col justify-between p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 select-none",
                isSelected
                  ? "border-primary bg-accent/60 shadow-xs ring-1 ring-primary/20"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
              )}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-xs font-bold text-foreground">
                  {category.label}
                </span>
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full border transition-all shrink-0",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background group-hover:border-primary/40"
                  )}
                >
                  {isSelected && <Check className="size-2.5 stroke-3" />}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                {category.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
