import { LessonPlayerPage } from "@/features/learn/LessonPlayerPage";
import { StudentViewModal } from "@/features/learn/components/StudentViewModal";
import { getLessonPlayer } from "@/features/learn/server/getLessonPlayer";
import { getResumeLesson } from "@/features/learn/server/getResumeLesson";

type Params = {
    params: Promise<{ slug: string }>;
};

/**
 * An INTERCEPTED route: "(..)(..)learn" = "catch /learn/..., two levels up from /teacher/courses".
 * A link to /learn/... clicked on My courses (/teacher/courses) opens HERE, in the @modal slot,
 * on top of the page. A refresh / a direct visit opens the real /learn page.
 *
 * Why 2 pages? The teacher reaches the modal with 2 kinds of links, and a page.tsx answers ONE link only
 * (the link that looks like its folders):
 *
 *     how                             the link                    the page                      what it does                 
 * "View as student" button           /learn/<course>            [slug]/page.tsx (THIS one)    finds the first lesson → shows it 
 * moving inside the modal            /learn/<course>/<lesson>   [slug]/[lessonId]/page.tsx    shows that lesson right away 
 *
 * 1- THIS page: "View as student" (My courses → ⋯) only knows the course, not its lessons
 *    (the course row comes from get_teacher_courses, without lessons) → the link has no lesson →
 *    we ask the database which lesson to open (getResumeLesson → the first one), then show it.
 * 2- [lessonId]/page.tsx: a click on another lesson inside the modal (curriculum / Next / Previous)
 *    → the link HAS the lesson → it is shown right away.
 *
 * With only one of the 2 pages, the other link finds no page in the modal → Next.js leaves the modal
 * and opens the full /learn page. The real /learn route has the same 2 pages for the same reason.
 * (one loading.tsx in [slug] is enough: a loading.tsx covers its folder AND every folder under it)
 */
export default async function StudentViewOfCourse({ params }: Params) {
    const { slug } = await params;

    // the teacher of the course sees every lesson → open the first one
    const lessonId = await getResumeLesson(slug);
    const player = lessonId ? await getLessonPlayer(slug, lessonId) : null;

    return (
        <StudentViewModal>
            {player ? (
                <LessonPlayerPage player={player} />
            ) : (
                <p className="px-6 py-16 text-center text-sm text-muted-foreground">
                    This course has no lessons yet. Add them in the Curriculum tab.
                </p>
            )}
        </StudentViewModal>
    );
}
