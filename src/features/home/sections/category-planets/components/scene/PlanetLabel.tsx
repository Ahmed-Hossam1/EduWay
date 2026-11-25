import { Ref } from "react";
import { cn } from "@/lib/utils";

type PlanetLabelProps = {
    ref: Ref<HTMLSpanElement>; // the Planet moves it on every frame (style.transform)
    name: string;
    isSelected: boolean;
};

// The small name above a planet: plain HTML on top of the canvas (not 3D).
// It starts at the top left (0, 0); the Planet puts it above itself on the first frame.
export function PlanetLabel({ ref, name, isSelected }: PlanetLabelProps) {
    return (
        <span
            ref={ref}
            className={cn(
                "pointer-events-none absolute top-0 left-0 rounded-md border bg-card px-2 py-0.5 text-xs whitespace-nowrap shadow-xs",
                isSelected ? "border-primary font-semibold text-primary" : "border-border text-muted-foreground",
            )}
        >
            {name}
        </span>
    );
}
