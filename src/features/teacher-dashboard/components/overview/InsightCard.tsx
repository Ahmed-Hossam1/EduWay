import { use } from "react";
import { Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewInsight } from "../../types";

type InsightCardProps = {
    insightPromise: Promise<OverviewInsight>;
};

// One sentence about the teacher's numbers ("Enrollments are up 5.4%...")
export function InsightCard({ insightPromise }: InsightCardProps) {
    const insight = use(insightPromise); // waits inside the <Suspense> of TeacherOverview
    const TrendIcon = insight.trend === "up" ? TrendingUp : TrendingDown;

    return (
        <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 sm:col-span-2">
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
                    {insight.text}
                </p>
            </CardContent>
        </Card>
    );
}
