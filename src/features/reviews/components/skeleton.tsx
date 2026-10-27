import { Skeleton } from "@/components/ui/skeleton";
import { CommentsListSkeleton } from "@/features/comments/components/skeleton";

// The whole reviews section while it loads: title + the average and the 5 star bars + the list
export function CourseReviewsSkeleton() {
    return (
        <div className="space-y-8">
            <Skeleton className="h-8 w-32" />
            <div className="grid gap-6 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-12 w-20" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <Skeleton key={item} className="h-2 w-full" />
                    ))}
                </div>
            </div>
            <CommentsListSkeleton />
        </div>
    );
}
