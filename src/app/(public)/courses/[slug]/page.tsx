import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseDetailsPage } from "@/features/course-details/CourseDetailsPage";
import { getCourseBySlug } from "@/features/course-details/server/getCourseBySlug";
import { getRelatedCourses } from "@/features/course-details/server/getRelatedCourses";

type Params = {
    params: Promise<{ slug: string }>
}

// SEO: title, description and preview image come from the course itself
export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const course = await getCourseBySlug(slug); // cached =>  the page below doesn't ask the database again

    if (!course) return { title: "Course not found" };

    return {
        title: course.title,
        description: course.short_description ?? undefined,
        openGraph: {
            title: course.title,
            description: course.short_description ?? undefined,
            images: course.thumbnail_url ? [course.thumbnail_url] : undefined,
        },
    };
}

export default async function CourseDetails({ params }: Params) {
    const { slug } = await params;

    // 1- The course itself: we wait for it, because we need it for the 404 and the whole page
    const course = await getCourseBySlug(slug);
    if (!course) notFound();

    // 2- Related courses: no await => streamed with <Suspense> (same idea as the courses page)
    const relatedCoursesPromise = getRelatedCourses(course.id, course.categories[0]?.slug);

    return <CourseDetailsPage course={course} relatedCoursesPromise={relatedCoursesPromise} />;
}
