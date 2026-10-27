import { Skeleton } from "@/components/ui/skeleton";
import { CommentsListSkeleton } from "@/features/comments/components/skeleton";

// The whole Q&A section while it loads: title + the "ask" box + the list
export function CourseQuestionsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-72" />
                <Skeleton className="h-4 w-96 max-w-full" />
            </div>
            <Skeleton className="h-28 w-full rounded-2xl" />
            <CommentsListSkeleton />
        </div>
    );
}
