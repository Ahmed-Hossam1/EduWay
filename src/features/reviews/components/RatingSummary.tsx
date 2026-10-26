import { Star } from "lucide-react";
import { RatingStars } from "@/components/shared/RatingStars";
import { Progress } from "@/components/ui/progress";
import { formatCompactNumber } from "@/features/courses/utils/format";
import { CourseReviewsPage } from "../types";

type RatingSummaryProps = {
    summary: CourseReviewsPage["summary"];
};

// The big average + how many reviews gave 5, 4, 3, 2, 1 stars
export function RatingSummary({ summary }: RatingSummaryProps) {
    const { average, count, stars } = summary;

    return (
        <div className="grid gap-6 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
            <div className="text-center">
                <p className="text-5xl font-bold text-amber-600 dark:text-amber-400">{average.toFixed(1)}</p>
                <RatingStars rating={average} className="mt-2 justify-center" />
                <p className="mt-1 text-sm text-muted-foreground">
                    {formatCompactNumber(count)} {count === 1 ? "rating" : "ratings"}
                </p>
            </div>

            <ul className="space-y-2">
                {stars.map((row) => {
                    const percent = count > 0 ? Math.round((row.count / count) * 100) : 0;

                    return (
                        <li key={row.stars} className="flex items-center gap-3 text-sm">
                            <span className="flex w-10 shrink-0 items-center gap-1 text-muted-foreground">
                                {row.stars}
                                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            </span>
                            <Progress value={percent} className="flex-1" aria-label={`${row.stars} stars`} />
                            <span className="w-10 shrink-0 text-right text-muted-foreground tabular-nums">
                                {percent}%
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
