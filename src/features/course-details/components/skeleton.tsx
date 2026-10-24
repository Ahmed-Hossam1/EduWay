import { Skeleton } from "@/components/ui/skeleton";

// The skeletons of the course details page

export function RelatedCoursesSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-7 w-64" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="space-y-3">
                        <Skeleton className="aspect-16/10 w-full rounded-xl" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}
