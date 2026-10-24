import { use } from "react";
import { Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "./DashboardCard";
import { pluralize } from "@/lib/format";
import { OverviewStats } from "../../types";

type InsightCardProps = {
    statsPromise: Promise<OverviewStats>; // the SAME promise as the stats cards → no extra call
};

// One sentence about the new students: the last 30 days vs the 30 days before
export function InsightCard({ statsPromise }: InsightCardProps) {
    const { studentsLast30Days: last30, studentsPrevious30Days: before30 } = use(statsPromise);

    const isUp = last30 >= before30;
    const TrendIcon = isUp ? TrendingUp : TrendingDown;
    const students = `${last30} new ${pluralize(last30, "student")}`;

    // nothing to compare with yet → just say how many
    const text =
        before30 === 0
            ? `${students} joined your courses in the last 30 days.`
            : `${students} in the last 30 days, ${isUp ? "up" : "down"} from ${before30} the 30 days before.`;

    return (
        <DashboardCard className="sm:col-span-2">
            <CardHeader className="grid-cols-[auto_1fr] items-center gap-x-3">
                <span className="row-span-2 flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="size-4" />
                </span>
                <CardTitle className="font-bold">EduWay insights</CardTitle>
                <CardDescription className="text-xs">From your latest numbers</CardDescription>
            </CardHeader>

            <CardContent>
                <p className="flex items-center gap-2 text-sm">
                    <TrendIcon className="size-4 shrink-0 text-primary" />
                    {text}
                </p>
            </CardContent>
        </DashboardCard>
    );
}
