import { notFound } from "next/navigation";
import { CourseEditHeader } from "@/features/course-builder/components/CourseEditHeader";
import { CourseEditTabs } from "@/features/course-builder/components/CourseEditTabs";
import { PublishChecklist } from "@/features/course-builder/components/PublishChecklist";
import { getCourseForEdit } from "@/features/course-builder/server/getCourseForEdit";

/**
 * /teacher/courses/[courseId]/edit/* — the same frame for every tab:
 * the header + the tabs on top, the tab in the middle (children = Details / Pricing / Publish),
 * the publish checklist on the right.
 */
export default async function CourseEditLayout({ children, params }: LayoutProps<"/teacher/courses/[courseId]/edit">) {
    const { courseId } = await params;

    // only the teacher who owns the course gets it (cached: the tab page reuses it)
    const course = await getCourseForEdit(courseId);
    if (!course) notFound();

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <CourseEditHeader course={course} />
            <CourseEditTabs courseId={course.id} />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="min-w-0">{children}</div>

                <aside>
                    <div className="lg:sticky lg:top-20">
                        <PublishChecklist course={course} />
                    </div>
                </aside>
            </div>
        </div>
    );
}
