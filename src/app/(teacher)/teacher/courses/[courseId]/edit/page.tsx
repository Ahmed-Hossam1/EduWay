import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseDetailsForm } from "@/features/course-builder/components/details/CourseDetailsForm";
import { getCourseForEdit } from "@/features/course-builder/server/getCourseForEdit";
import { getPrerequisiteOptions } from "@/features/course-builder/server/getPrerequisiteOptions";
import { getAllCategories } from "@/features/categories/server/getAllCategories";

export const metadata: Metadata = {
    title: "Edit course",
    robots: { index: false },
};

type Params = {
    params: Promise<{ courseId: string }>;
};

// /teacher/courses/[courseId]/edit → the Details tab
export default async function EditCourseDetails({ params }: Params) {
    const { courseId } = await params;

    // the course is cached (the layout asked already) + the 2 option lists at the same time
    const [course, categories, prerequisiteOptions] = await Promise.all([
        getCourseForEdit(courseId),
        getAllCategories(),
        getPrerequisiteOptions(courseId),
    ]);
    if (!course) notFound();

    // key = updated_at → after a save + refresh the form starts again from the saved values
    return (
        <CourseDetailsForm
            key={course.updated_at}
            course={course}
            categories={categories}
            prerequisiteOptions={prerequisiteOptions}
        />
    );
}
