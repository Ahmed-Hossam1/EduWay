import { SectionHeading } from "@/components/shared/SectionHeading";
import { CourseCard } from "@/features/courses/components/CourseCard";
import { coursesQuerySchema } from "@/features/courses/schemas/coursesQuerySchema";
import { getCourses } from "@/features/courses/server/getCourses";

export async function FeaturedCoursesSection() {
  // 5 most popular published courses
  const { courses } = await getCourses(coursesQuerySchema.parse({ sort: "popular" }), 5);

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-muted/20 border-y border-border/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured Courses"
          subtitle="Handpicked courses to help you get started."
          actionText="View All Courses"
          actionHref="/courses"
        />

        {/* Responsive 5-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
