import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CurriculumEditor } from "@/features/course-builder/components/curriculum/CurriculumEditor";
import { getCourseCurriculum } from "@/features/course-builder/server/getCourseCurriculum";

export const metadata: Metadata = {
    title: "Course curriculum",
    robots: { index: false },
};

type Params = {
    params: Promise<{ courseId: string }>;
};

// /teacher/courses/[courseId]/edit/curriculum → the Curriculum tab (sections + lessons, drag to reorder)
export default async function EditCourseCurriculum({ params }: Params) {
    const { courseId } = await params;

    const curriculum = await getCourseCurriculum(courseId);
    if (!curriculum) notFound();

    // key = the whole curriculum → after add / rename / delete + refresh, the editor starts from the new data
    return <CurriculumEditor key={JSON.stringify(curriculum)} courseId={courseId} curriculum={curriculum} />;
}
