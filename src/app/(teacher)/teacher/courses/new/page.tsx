import { Metadata } from "next";
import { CreateCourseForm } from "@/features/course-builder/components/CreateCourseForm";
import { getAllCategories } from "@/features/categories/server/getAllCategories";

export const metadata: Metadata = {
    title: "Create a course",
    robots: { index: false },
};

// /teacher/courses/new (the teacher layout already checked he's an approved teacher)
export default async function NewCourse() {
    const categories = await getAllCategories();

    return (
        <div className="mx-auto max-w-xl space-y-6 py-4">
            <div>
                <h1 className="text-2xl font-black tracking-tight">Create a new course</h1>
                <p className="text-sm text-muted-foreground">
                    Start with a title and a category. You&apos;ll add everything else on the next page.
                </p>
            </div>

            <CreateCourseForm categories={categories} />
        </div>
    );
}
