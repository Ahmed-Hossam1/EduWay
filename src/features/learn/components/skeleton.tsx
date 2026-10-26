import { Skeleton } from "@/components/ui/skeleton";

// The lesson player while it loads: the same boxes as LessonPlayerPage (video + info on the left, curriculum on the right)
export function LessonPlayerSkeleton() {
    return (
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                {/* the video + the lesson info */}
                <div className="min-w-0 space-y-6">
                    <Skeleton className="aspect-video w-full rounded-xl" />

                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <Skeleton className="h-8 w-2/3" />
                        <Skeleton className="h-8 w-40" />
                    </div>
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-36" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>

                {/* the curriculum */}
                <div className="overflow-hidden rounded-xl border border-border">
                    <div className="space-y-3 border-b border-border p-4">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-1 w-full" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    {Array.from({ length: 2 }).map((_, sectionIndex) => (
                        <div key={sectionIndex}>
                            <Skeleton className="h-8 w-full rounded-none" />
                            {Array.from({ length: 3 }).map((_, lessonIndex) => (
                                <div key={lessonIndex} className="flex items-center gap-3 border-t border-border px-4 py-3">
                                    <Skeleton className="size-4 rounded-full" />
                                    <Skeleton className="h-4 flex-1" />
                                    <Skeleton className="h-3 w-10" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
