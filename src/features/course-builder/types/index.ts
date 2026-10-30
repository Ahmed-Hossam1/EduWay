import { Course, Lesson, LessonVideo, Section, VideoStatus } from "@/features/courses/types";

// What can still be missing before a course can be published (from the database: course_publish_missing)
export type PublishMissingKey =
    | "short_description"
    | "description"
    | "thumbnail"
    | "category"
    | "learning_outcomes"
    | "lesson_videos"; // no lesson yet, or a lesson without a video

// What get_course_for_edit() returns (database function) — only for the teacher who owns the course
export type CourseForEdit = Pick<
    Course,
    | "id"
    | "title"
    | "slug" // made once at creation, never changes
    | "status"
    | "short_description"
    | "description"
    | "thumbnail_url"
    | "language"
    | "level"
    | "price"
    | "currency"
    | "learning_outcomes"
    | "requirements"
    | "published_at"
    | "updated_at"
    | "lessons_count"
    | "students_count"
> & {
    categoryIds: string[];
    tags: string[]; // the tag names: ["React", "Hooks"]
    prerequisites: Pick<Course, "id" | "title" | "slug">[];
    missing: PublishMissingKey[]; // [] → ready to publish
};

// What publish_course() returns
export interface PublishResult {
    published: boolean;
    missing: PublishMissingKey[];
}

// A published course the teacher can choose as "finish this course first"
export type PrerequisiteOption = Pick<Course, "id" | "title">;

// One lesson in the Curriculum tab (what get_course_curriculum returns)
export type CurriculumLesson = Pick<Lesson, "id" | "title" | "description" | "duration_seconds" | "position" | "is_preview"> & {
    has_video: boolean; // a video is uploaded (lesson_videos)
    video_version: number | null; // changes with every upload (for the preview address), null = no video
    video_status: VideoStatus | null; // null = no video
} & Pick<LessonVideo, "hls_url" | "poster_url">;

// One section in the Curriculum tab, with its lessons (both sorted by position)
export type CurriculumSection = Pick<Section, "id" | "title" | "position"> & {
    lessons: CurriculumLesson[];
};
