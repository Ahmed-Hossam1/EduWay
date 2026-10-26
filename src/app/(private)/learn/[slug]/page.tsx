import { notFound, redirect } from "next/navigation";
import { getResumeLesson } from "@/features/learn/server/getResumeLesson";
import { getLessonHref } from "@/features/learn/utils";

type Params = {
    params: Promise<{ slug: string }>;
};

// /learn/[slug] → opens the right lesson ("Go to course" / "Continue learning")
//   enrolled → the first lesson not done yet | not enrolled → the first free preview lesson
export default async function LearnCourse({ params }: Params) {
    const { slug } = await params;

    const lessonId = await getResumeLesson(slug);
    if (!lessonId) notFound();

    redirect(getLessonHref(slug, lessonId));
}
