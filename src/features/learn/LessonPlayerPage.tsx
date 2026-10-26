import { LessonInfo } from "./components/LessonInfo";
import { LessonVideoPlayer } from "./components/LessonVideoPlayer";
import { PlayerCurriculum } from "./components/PlayerCurriculum";
import { LessonPlayer } from "./types";

type LessonPlayerPageProps = {
    player: LessonPlayer;
};

/**
 * /learn/[slug]/[lessonId]: the video + the lesson info on the left, the curriculum on the right
 * (on a phone the curriculum goes under the lesson).
 */
export function LessonPlayerPage({ player }: LessonPlayerPageProps) {
    const { course, lesson, sections, progress, isEnrolled, previousLessonId, nextLessonId } = player;

    return (
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="min-w-0 space-y-6">
                    {/* key = the lesson → another lesson = a fresh player (its state starts again) */}
                    <LessonVideoPlayer
                        key={lesson.id}
                        lesson={lesson}
                        courseSlug={course.slug}
                        canSaveProgress={isEnrolled}
                    />
                    <LessonInfo
                        lesson={lesson}
                        courseSlug={course.slug}
                        previousLessonId={previousLessonId}
                        nextLessonId={nextLessonId}
                        canSaveProgress={isEnrolled}
                    />
                </div>

                <aside>
                    <div className="lg:sticky lg:top-20">
                        <PlayerCurriculum
                            courseSlug={course.slug}
                            courseTitle={course.title}
                            sections={sections}
                            currentLessonId={lesson.id}
                            progress={progress}
                            showProgress={isEnrolled}
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
}
