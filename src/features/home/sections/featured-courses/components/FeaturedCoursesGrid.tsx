import { use } from "react";
import { CourseCard } from "@/features/courses/components/CourseCard";
import { Course } from "@/features/courses/types";

type FeaturedCoursesGridProps = {
    coursesPromise: Promise<Course[]>;
};

// Streamed with <Suspense>: use() waits for the promise
export function FeaturedCoursesGrid({ coursesPromise }: FeaturedCoursesGridProps) {
    const courses = use(coursesPromise);

    return (
        // Responsive 5-card grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}
