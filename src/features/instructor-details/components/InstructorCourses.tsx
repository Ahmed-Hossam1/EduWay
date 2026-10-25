import { use } from "react";
import { BookOpen } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { CourseCard } from "@/features/courses/components/CourseCard";
import type { CourseCard as CourseCardData } from "@/features/courses/types"; // the component is called CourseCard too

type InstructorCoursesProps = {
    coursesPromise: Promise<CourseCardData[]>;
    instructorName: string;
};

// The teacher's courses — streamed with <Suspense> (reuses CourseCard)
export function InstructorCourses({ coursesPromise, instructorName }: InstructorCoursesProps) {
    const courses = use(coursesPromise);

    return (
        <section aria-labelledby="instructor-courses-title">
            <h2 id="instructor-courses-title" className="text-2xl font-bold tracking-tight text-foreground">
                Courses by {instructorName} <span className="text-muted-foreground">({courses.length})</span>
            </h2>

            {courses.length === 0 ? (
                <Empty className="mt-5 border border-dashed py-12">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <BookOpen />
                        </EmptyMedia>
                        <EmptyTitle>No courses yet</EmptyTitle>
                        <EmptyDescription>This instructor hasn&apos;t published any courses yet.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </section>
    );
}
