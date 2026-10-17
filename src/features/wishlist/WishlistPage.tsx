import { Suspense } from "react";
import { CoursesSkeleton } from "@/features/courses/components/CoursesSkeleton";
import { Course } from "@/features/courses/types";
import { WishlistGrid } from "./components/WishlistGrid";

type WishlistPageProps = {
    coursesPromise: Promise<Course[]>;
};

export function WishlistPage({ coursesPromise }: WishlistPageProps) {
    return (
        <section className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">My wishlist</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Courses you saved to take later.</p>

            <div className="mt-8">
                <Suspense fallback={<CoursesSkeleton />}>
                    <WishlistGrid coursesPromise={coursesPromise} />
                </Suspense>
            </div>
        </section>
    );
}
