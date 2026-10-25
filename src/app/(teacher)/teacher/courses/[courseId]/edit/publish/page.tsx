import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoursePublishPanel } from "@/features/course-builder/components/publish/CoursePublishPanel";
import { getCourseForEdit } from "@/features/course-builder/server/getCourseForEdit";

export const metadata: Metadata = {
    title: "Publish course",
    robots: { index: false },
};

type Params = {
    params: Promise<{ courseId: string }>;
};

// /teacher/courses/[courseId]/edit/publish → the Publish tab
export default async function EditCoursePublish({ params }: Params) {
    const { courseId } = await params;

    const course = await getCourseForEdit(courseId); // cached: the layout asked already
    if (!course) notFound();

    return <CoursePublishPanel course={course} />;
}
