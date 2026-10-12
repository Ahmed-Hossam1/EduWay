import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading state of the instructor cards — same shape as <InstructorCard />
export function InstructorsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
                <Card key={item}>
                    {/* Avatar + name + headline + skills */}
                    <CardContent className="flex flex-col items-center gap-3">
                        <Skeleton className="size-20 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-44" />
                        <div className="flex gap-1.5">
                            <Skeleton className="h-5 w-14 rounded-full" />
                            <Skeleton className="h-5 w-14 rounded-full" />
                            <Skeleton className="h-5 w-14 rounded-full" />
                        </div>
                    </CardContent>

                    {/* Stats */}
                    <CardFooter className="grid grid-cols-3 gap-3">
                        <Skeleton className="h-9" />
                        <Skeleton className="h-9" />
                        <Skeleton className="h-9" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
