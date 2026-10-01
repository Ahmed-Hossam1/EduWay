"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ChooseRoleCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    features: string[];
    accentColor: string;
    id: string;
    selected: boolean;
    onClick: () => void;
}

export default function ChooseRoleCard({
    icon,
    title,
    description,
    features,
    selected,
    onClick,
    accentColor,
    id,
}: ChooseRoleCardProps) {
    return (
        <Card
            id={id}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            onClick={onClick}
            className={cn(
                "group relative flex w-full cursor-pointer flex-col gap-6 rounded-2xl border-2 p-6 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-8",
                selected
                    ? "border-primary bg-accent/60 shadow-lg shadow-primary/10 ring-0"
                    : "border-border bg-card hover:border-primary/40 hover:bg-accent/20 hover:shadow-md ring-0"
            )}
        >
            {/* Selected indicator */}
            <span
                className={cn(
                    "absolute right-4 top-4 flex size-5 items-center justify-center rounded-full border-2 transition-all duration-200",
                    selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background group-hover:border-primary/50"
                )}
            >
                {selected && <Check className="size-3 stroke-3" aria-hidden="true" />}
            </span>

            <CardHeader className="gap-4 p-0">
                {/* Icon */}
                <div
                    className={cn(
                        "flex size-14 items-center justify-center rounded-xl transition-all duration-300",
                        selected
                            ? `${accentColor} shadow-md`
                            : "bg-muted group-hover:" + accentColor
                    )}
                >
                    {icon}
                </div>

                {/* Text */}
                <div className="space-y-1.5">
                    <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                        {title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                        {description}
                    </CardDescription>
                </div>
            </CardHeader>

            {/* Feature list */}
            <CardContent className="p-0">
                <ul className="w-full space-y-2.5">
                    {features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-sm text-foreground/80">
                            <span
                                className={cn(
                                    "flex size-4.5 shrink-0 items-center justify-center rounded-full",
                                    selected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                                )}
                            >
                                <Check className="size-2.5 stroke-3" aria-hidden="true" />
                            </span>
                            {feat}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
