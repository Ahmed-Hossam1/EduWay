import { ComponentProps } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * A card of the teacher Overview: a shadcn Card + the same hover lift on every card.
 * Pass the extra classes of each card (width, colors) as usual: <DashboardCard className="sm:col-span-2">
 */
export function DashboardCard({ className, ...props }: ComponentProps<typeof Card>) {
    return (
        <Card
            className={cn(
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10",
                className,
            )}
            {...props}
        />
    );
}
