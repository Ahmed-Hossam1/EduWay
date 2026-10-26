import { LessonPlayerPage } from "@/features/learn/LessonPlayerPage";
import { StudentViewModal } from "@/features/learn/components/StudentViewModal";
import { getLessonPlayer } from "@/features/learn/server/getLessonPlayer";

type Params = {
    params: Promise<{ slug: string; lessonId: string }>;
};

/**
 * Inside the "View as student" modal: a click on another lesson (curriculum / Next / Previous)
 * is intercepted too → the modal stays open and shows that lesson.
 *
 * Why a 2nd page next to [slug]/page.tsx? A page.tsx answers ONE link only (the link that looks like its folders):
 *   /learn/<course>           → [slug]/page.tsx               ("View as student": no lesson in the link → finds the first one)
 *   /learn/<course>/<lesson>  → [slug]/[lessonId]/page.tsx    (THIS one: the lesson is in the link → shown right away)
 *
 * Without THIS page, a lesson link clicked inside the modal finds no page in the modal
 * → Next.js leaves the modal and opens the full /learn page.
 * (the loading.tsx of [slug] covers this page too)
 */
export default async function StudentViewOfLesson({ params }: Params) {
    const { slug, lessonId } = await params;
    const player = await getLessonPlayer(slug, lessonId);

    return (
        <StudentViewModal>
            {player ? (
                <LessonPlayerPage player={player} />
            ) : (
                <p className="px-6 py-16 text-center text-sm text-muted-foreground">This lesson was not found.</p>
            )}
        </StudentViewModal>
    );
}
