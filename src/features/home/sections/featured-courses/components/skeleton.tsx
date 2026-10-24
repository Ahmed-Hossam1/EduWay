import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// The skeletons of the featured courses section (same grid + card shape as the real cards)

export function FeaturedCoursesSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
                <Card key={item} className="pt-0">
                    <Skeleton className="aspect-16/10 w-full rounded-none" />
                    <CardHeader>
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-6 rounded-full" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-3 w-32" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-5 w-16" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
