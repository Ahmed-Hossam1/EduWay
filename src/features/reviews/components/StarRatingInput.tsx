"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StarRatingInputProps = {
    value: number; // 0 = nothing chosen yet
    onChange: (rating: number) => void;
};

const STARS = [1, 2, 3, 4, 5];
const STAR_LABELS = ["Awful", "Poor", "Average", "Good", "Amazing"];

// Choose 1 → 5 stars: hover shows the stars you will give, click chooses them
export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
    const [hovered, setHovered] = useState(0);
    const shown = hovered || value; // while hovering → the hovered star, else → the chosen one

    return (
        <div className="flex items-center gap-2">
            <div role="radiogroup" aria-label="Rating" className="flex" onMouseLeave={() => setHovered(0)}>
                {STARS.map((star) => (
                    <Button
                        key={star}
                        type="button"
                        variant="ghost"
                        size="icon"
                        rounded="full"
                        role="radio"
                        aria-checked={value === star}
                        aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                        onMouseEnter={() => setHovered(star)}
                        onClick={() => onChange(star)}
                    >
                        <Star
                            className={cn(
                                "size-6",
                                star <= shown ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40",
                            )}
                        />
                    </Button>
                ))}
            </div>
            {shown > 0 && <span className="text-sm font-medium text-muted-foreground">{STAR_LABELS[shown - 1]}</span>}
        </div>
    );
}
