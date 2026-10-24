import { Skeleton } from "@/components/ui/skeleton";

// The skeletons of the instructor details page

export function InstructorStatsCardsSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-24 rounded-2xl" />
            ))}
        </div>
    );
}
