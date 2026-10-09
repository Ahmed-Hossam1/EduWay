import { Skeleton } from "@/components/ui/skeleton";

export function CoursesCategoryChipsSkeleton() {
    return (
        <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} className="h-10 w-24 rounded-lg " />
            ))}
        </div>
    )
}
