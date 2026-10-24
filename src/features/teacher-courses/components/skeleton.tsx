import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// The skeletons of the My courses page (same shape as the real parts → no jump when the data arrives)

export function TeacherCoursesSummarySkeleton() {
    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
                <Card key={item} size="sm">
                    <CardHeader>
                        <Skeleton className="h-3 w-20" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-7 w-16" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function TeacherCoursesListSkeleton() {
    return (
        <Card className="gap-0 py-0">
            {[1, 2, 3, 4].map((item) => (
                <div
                    key={item}
                    className={`grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 border-t border-border px-4 py-3 first:border-t-0
                        md:grid-cols-[96px_minmax(0,1fr)_96px_96px_88px]`}
                >
                    <Skeleton className="aspect-16/10 w-full rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="hidden h-4 w-12 md:block" />
                    <Skeleton className="hidden h-4 w-14 md:block" />
                    <Skeleton className="hidden size-8 md:block" />
                </div>
            ))}
        </Card>
    );
}
