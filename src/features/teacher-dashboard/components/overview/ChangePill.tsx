import { cn } from "@/lib/utils";

type ChangePillProps = {
    value: number; // % (can be negative)
};

// A small "+5.5%" / "-1.2%" pill (green up, red down)
export function ChangePill({ value }: ChangePillProps) {
    const isUp = value >= 0;

    return (
        <span
            className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                isUp
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
            )}
        >
            {isUp ? "+" : ""}
            {value}%
        </span>
    );
}
