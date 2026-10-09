import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading state of the course cards — same shape as <CourseCard /> (image on top)
export default function CoursesSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="pt-0">
                    {/* Thumbnail */}
                    <Skeleton className="aspect-16/10 w-full rounded-none" />

                    {/* Title */}
                    <CardHeader>
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>

                    {/* Instructor + rating */}
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-6 rounded-full" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-3 w-32" />
                    </CardContent>

                    {/* Price */}
                    <CardFooter>
                        <Skeleton className="h-5 w-16" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
