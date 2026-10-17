import { Suspense } from "react";
import { CoursesSkeleton } from "@/features/courses/components/CoursesSkeleton";
import { EnrolledCourse } from "./types";
import { MyCoursesGrid } from "./components/MyCoursesGrid";

type MyCoursesPageProps = {
    myCoursesPromise: Promise<EnrolledCourse[]>;
};

export function MyCoursesPage({ myCoursesPromise }: MyCoursesPageProps) {
    return (
        <section className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">My courses</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Pick up where you left off.</p>

            <div className="mt-8">
                <Suspense fallback={<CoursesSkeleton />}>
                    <MyCoursesGrid myCoursesPromise={myCoursesPromise} />
                </Suspense>
            </div>
        </section>
    );
}
