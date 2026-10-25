import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoursePricingForm } from "@/features/course-builder/components/pricing/CoursePricingForm";
import { getCourseForEdit } from "@/features/course-builder/server/getCourseForEdit";

export const metadata: Metadata = {
    title: "Course pricing",
    robots: { index: false },
};

type Params = {
    params: Promise<{ courseId: string }>;
};

// /teacher/courses/[courseId]/edit/pricing → the Pricing tab
export default async function EditCoursePricing({ params }: Params) {
    const { courseId } = await params;

    const course = await getCourseForEdit(courseId); // cached: the layout asked already
    if (!course) notFound();

    // key = updated_at → after a save + refresh the form starts again from the saved price
    return <CoursePricingForm key={course.updated_at} course={course} />;
}
