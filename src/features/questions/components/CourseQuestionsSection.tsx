import { getCourseQuestions } from "../server/getCourseQuestions";
import { CourseQuestions } from "./CourseQuestions";

type CourseQuestionsSectionProps = {
    courseId: string;
    lessonId?: string | null; // nothing → the course page questions | id → the Q&A tab of this lesson
};

/**
 * Server component: loads the first page of questions, then shows the list.
 * Put it inside <Suspense fallback={<CourseQuestionsSkeleton />}> → the page doesn't wait for the questions.
 * Used on the course page (questions before buying) AND in the "Q&A" tab of the lesson player.
 */
export async function CourseQuestionsSection({ courseId, lessonId = null }: CourseQuestionsSectionProps) {
    const firstPage = await getCourseQuestions(courseId, lessonId);

    // not allowed to see this place (a lesson of a course you didn't buy)
    if (!firstPage) return null;

    return <CourseQuestions courseId={courseId} lessonId={lessonId} firstPage={firstPage} />;
}
