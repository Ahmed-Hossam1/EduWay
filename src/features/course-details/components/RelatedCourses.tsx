import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CourseCard } from "@/features/courses/components/CourseCard";
import { Course } from "@/features/courses/types";

type RelatedCoursesProps = {
  relatedCoursesPromise: Promise<Course[]>;
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
        title={categoryName ? `More courses in ${categoryName}` : "More courses"}
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

export function RelatedCoursesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-64" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="space-y-3">
            <Skeleton className="aspect-16/10 w-full rounded-xl" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
