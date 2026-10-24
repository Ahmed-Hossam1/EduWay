import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// The skeletons of the Overview cards (same Card shape as the real ones → no jump when the data arrives)

export function StatsCardsSkeleton() {
    return (
        <>
            {[1, 2, 3, 4].map((item) => (
                <Card key={item}>
                    <CardHeader>
                        <Skeleton className="h-3 w-24" />
                    </CardHeader>
                    <CardContent className="flex items-end justify-between">
                        <Skeleton className="h-7 w-20" />
                        <Skeleton className="h-7 w-14" />
                    </CardContent>
                </Card>
            ))}
        </>
    );
}

export function EarningsChartSkeleton() {
    return (
        <Card className="sm:col-span-2 xl:col-span-3">
            <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-24" />
            </CardHeader>
            <CardContent>
                <div className="flex gap-3">
                    <Skeleton className="h-12 w-28 rounded-xl" />
                    <Skeleton className="h-12 w-32 rounded-xl" />
                </div>
                <Skeleton className="mt-4 h-36 w-full rounded-xl" />
                <Skeleton className="mt-2 h-3 w-full" />
            </CardContent>
        </Card>
    );
}

export function InsightCardSkeleton() {
    return (
        <Card className="sm:col-span-2">
            <CardHeader className="grid-cols-[auto_1fr] items-center gap-x-3">
                <Skeleton className="row-span-2 size-9 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-4/5" />
            </CardContent>
        </Card>
    );
}

export function NewStudentsCardSkeleton() {
    return (
        <Card className="sm:col-span-2">
            <CardHeader>
                <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-3">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                        <Skeleton className="size-8 rounded-full" />
                        <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3 w-1/3" />
                            <Skeleton className="h-2.5 w-1/4" />
                        </div>
                        <Skeleton className="h-3 w-10" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export function RecentSalesCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-3">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                        <Skeleton className="h-8 w-1" />
                        <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3 w-3/4" />
                            <Skeleton className="h-2.5 w-1/2" />
                        </div>
                        <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export function TopCoursesFanSkeleton() {
    return (
        <Card className="sm:col-span-2">
            <CardContent className="grid gap-4 sm:grid-cols-[1fr_1.3fr] sm:items-center">
                <div>
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="mt-2 h-3 w-48" />
                    <div className="mt-3 space-y-2">
                        {[1, 2, 3].map((item) => (
                            <Skeleton key={item} className="h-3 w-full" />
                        ))}
                    </div>
                </div>
                <Skeleton className="mx-auto h-36 w-44 rounded-xl" />
            </CardContent>
        </Card>
    );
}

export function TeacherProfileCardSkeleton() {
    return (
        <Card className="items-center">
            <CardContent className="flex w-full flex-col items-center">
                <Skeleton className="size-16 rounded-full" />
                <Skeleton className="mt-3 h-4 w-28" />
                <Skeleton className="mt-2 h-3 w-36" />
                <div className="mt-4 grid w-full grid-cols-3 gap-2">
                    {[1, 2, 3].map((item) => (
                        <Skeleton key={item} className="h-10" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
