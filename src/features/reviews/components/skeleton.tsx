import { Skeleton } from "@/components/ui/skeleton";

// The skeletons of the reviews section

// 3 comments: avatar + name + stars + 2 lines of text
export function ReviewsListSkeleton() {
    return (
        <div className="space-y-6">
            {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-3">
                    <Skeleton className="size-10 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// The whole section: title + the average and the 5 star bars + the list
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
            <ReviewsListSkeleton />
        </div>
    );
}
