import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesPaginationSkeleton() {
    return (
        <div className="flex gap-2 justify-center  overflow-hidden">
            {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} className="h-5 w-10" />
            ))}
        </div>
    )
}