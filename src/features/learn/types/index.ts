import { Course, Lesson, Section } from "@/features/courses/types";

// How far the student is in the course
export interface LessonProgress {
    completed: number; // lessons done
    total: number; // lessons in the course
    percent: number; // 0 → 100
}

// One lesson in the player curriculum (the list on the right)
export type PlayerLesson = Pick<Lesson, "id" | "title" | "duration_seconds" | "position" | "is_preview"> & {
    is_completed: boolean;
    can_watch: boolean; // false → a lock (not enrolled and not a free preview)
};

// One section of the player curriculum, with its lessons (both sorted)
export type PlayerSection = Pick<Section, "id" | "title" | "position"> & {
    lessons: PlayerLesson[];
};

// The lesson that is open in the player
export type CurrentLesson = Pick<Lesson, "id" | "title" | "description" | "duration_seconds" | "is_preview"> & {
    is_completed: boolean;
    can_watch: boolean;
    video: { public_id: string; version: number } | null; // null → no video yet, or not allowed to watch
};

// What get_lesson_player() returns (database function): everything the player page needs
export interface LessonPlayer {
    course: Pick<Course, "id" | "title" | "slug">;
    isEnrolled: boolean;
    isOwner: boolean;
    progress: LessonProgress;
    lesson: CurrentLesson;
    previousLessonId: string | null;
    nextLessonId: string | null;
    sections: PlayerSection[];
}

// What complete_lesson() returns: the new progress (+ every lesson done?)
export type CompleteLessonResult = LessonProgress & {
    courseCompleted: boolean;
};
