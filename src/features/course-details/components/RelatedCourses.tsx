import { use } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CourseCard } from "@/features/courses/components/CourseCard";
import type { CourseCard as CourseCardData } from "@/features/courses/types"; // the component is called CourseCard too

type RelatedCoursesProps = {
    relatedCoursesPromise: Promise<CourseCardData[]>;
    categoryName?: string;
    categorySlug?: string;
};

// "More courses in Web Development" — streamed: use() waits, <Suspense> shows the skeleton
export function RelatedCourses({ relatedCoursesPromise, categoryName, categorySlug }: RelatedCoursesProps) {
    const courses = use(relatedCoursesPromise);

    if (courses.length === 0) return null;

    return (
        <section>
            <SectionHeading
                title={categoryName ? `Related courses in ${categoryName}` : "Related courses"}
                actionText="View all"
                actionHref={categorySlug ? `/courses?category=${categorySlug}` : "/courses"}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </section>
    );
}
