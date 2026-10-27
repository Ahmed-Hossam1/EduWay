import { getCourseReviews } from "../server/getCourseReviews";
import { CourseReviews } from "./CourseReviews";

type CourseReviewsSectionProps = {
    courseId: string;
};

/**
 * Server component: loads the first page of reviews, then shows the section.
 * Put it inside <Suspense fallback={<CourseReviewsSkeleton />}> → the page doesn't wait for the reviews.
 * Used on the course page AND in the "Reviews" tab of the lesson player.
 */
export async function CourseReviewsSection({ courseId }: CourseReviewsSectionProps) {
    const firstPage = await getCourseReviews(courseId);

    // the course can't be seen (should not happen: the page already found it)
    if (!firstPage) return null;

    return <CourseReviews courseId={courseId} firstPage={firstPage} />;
}
