import { Suspense } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Course } from "@/features/courses/types";
import { FeaturedCoursesGrid } from "./components/FeaturedCoursesGrid";
import { FeaturedCoursesSkeleton } from "./components/skeleton";

type FeaturedCoursesSectionProps = {
    coursesPromise: Promise<Course[]>; // started in app/(public)/page.tsx (no await)
};

// The heading shows right away; the 5 cards stream in (the rest of the home page doesn't wait for the database)
export function FeaturedCoursesSection({ coursesPromise }: FeaturedCoursesSectionProps) {
    return (
        <section className="py-14 sm:py-20 lg:py-24 bg-muted/20 border-y border-border/50">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title="Featured Courses"
                    subtitle="Handpicked courses to help you get started."
                    actionText="View All Courses"
                    actionHref="/courses"
                />

                <Suspense fallback={<FeaturedCoursesSkeleton />}>
                    <FeaturedCoursesGrid coursesPromise={coursesPromise} />
                </Suspense>
            </div>
        </section>
    );
}
