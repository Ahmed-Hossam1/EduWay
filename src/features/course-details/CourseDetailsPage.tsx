import { Course } from "@/features/courses/types";
import { Suspense } from "react";
import { CourseCurriculum } from "./components/CourseCurriculum";
import { CourseDetailsHero } from "./components/CourseDetailsHero";
import { CourseInstructor } from "./components/CourseInstructor";
import { CourseLearningOutcomes } from "./components/CourseLearningOutcomes";
import { CourseMobileBar } from "./components/CourseMobileBar";
import { CoursePurchaseCard } from "./components/CoursePurchaseCard";
import { CourseRequirements } from "./components/CourseRequirements";
import { CourseTags } from "./components/CourseTags";
import { RelatedCourses, RelatedCoursesSkeleton } from "./components/RelatedCourses";
import { CourseDetails } from "./types";

type CourseDetailsPageProps = {
    course: CourseDetails;
    relatedCoursesPromise: Promise<Course[]>;
};

export function CourseDetailsPage({ course, relatedCoursesPromise }: CourseDetailsPageProps) {
    const category = course.categories[0];

    return (
        // pb-24 on mobile → space for the fixed bottom bar
        <div className="pb-24 lg:pb-0">
            <CourseDetailsHero course={course} />

            <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
                    {/* Purchase card: first on mobile, sticky on the right on desktop */}
                    <aside className="lg:order-last">
                        <div className="lg:sticky lg:top-24">
                            <CoursePurchaseCard course={course} />
                        </div>
                    </aside>

                    {/* Main content — every section hides itself when its data is empty */}
                    <div className="min-w-0 space-y-12">
                        <CourseLearningOutcomes outcomes={course.learning_outcomes} />

                        {/* course description */}
                        <div aria-labelledby="description-title">
                            <h2 id="description-title" className="text-2xl font-bold tracking-tight text-foreground">
                                About this course
                            </h2>
                            {/* whitespace-pre-line keeps the line breaks the teacher wrote */}
                            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
                                {course.description}
                            </p>
                        </div>

                        {/* course curriculum */}
                        <CourseCurriculum
                            sections={course.sections}
                            totalLessons={course.lessons_count}
                            totalSeconds={course.duration_seconds}
                        />
                        <CourseRequirements requirements={course.requirements} />
                        <CourseTags tags={course.tags} />
                        <CourseInstructor instructor={course.instructor} />
                    </div>
                </div>

                {/* Related courses: streamed, the page doesn't wait for them */}
                <div className="mt-16 border-t border-border/60 pt-12">
                    <Suspense fallback={<RelatedCoursesSkeleton />}>
                        <RelatedCourses
                            relatedCoursesPromise={relatedCoursesPromise}
                            categoryName={category?.name}
                            categorySlug={category?.slug}
                        />
                    </Suspense>
                </div>
            </div>

            {/* mobile bar to show enroll button */}
            <CourseMobileBar courseId={course.id} price={course.price} currency={course.currency} />
        </div>
    );
}
