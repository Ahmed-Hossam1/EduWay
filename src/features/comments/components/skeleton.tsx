import { Skeleton } from "@/components/ui/skeleton";

// 3 comments: avatar + name + 2 lines of text (a comment list while it loads)
export function CommentsListSkeleton() {
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
