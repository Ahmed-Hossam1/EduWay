import { Skeleton } from "@/components/ui/skeleton";

// Loading state of the filters sidebar while the categories come from the database
export default function CoursesFiltersSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-5 w-24" />

            {[1, 2, 3, 4].map((group) => (
                <div key={group} className="space-y-3 border-t border-border pt-5">
                    <Skeleton className="h-4 w-20" />
                    {[1, 2, 3].map((option) => (
                        <Skeleton key={option} className="h-4 w-full" />
                    ))}
                </div>
            ))}
        </div>
    );
}
