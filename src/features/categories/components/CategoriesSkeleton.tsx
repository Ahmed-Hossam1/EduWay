import { Skeleton } from "@/components/ui/skeleton";

// Loading state of <CategoriesContent /> — same shape: 3 big cards, then a grid of small ones
export function CategoriesSkeleton() {
    return (
        <div className="space-y-14">
            {/* Popular */}
            <div>
                <Skeleton className="h-7 w-56" />
                <Skeleton className="mt-2 h-4 w-44" />
                <div className="mt-6 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <Skeleton key={item} className="h-60 rounded-3xl" />
                    ))}
                </div>
            </div>

            {/* All */}
            <div>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="mt-2 h-4 w-28" />
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Skeleton key={item} className="h-20 rounded-2xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
