import { COURSE_LANGUAGES, LESSON_VIDEO_FOLDER } from "../constants";
import { EDIT_TABS, EditTab } from "../data/editTabs";
import { CourseDetailsValues } from "../schemas/courseDetailsSchema";
import { CourseForEdit } from "../types";

// "/teacher/courses/abc/edit" + "/pricing"
export const getEditHref = (courseId: string, tab: EditTab = "details") => {
    const path = EDIT_TABS.find((item) => item.tab === tab)?.path ?? "";
    return `/teacher/courses/${courseId}/edit${path}`;
};

/**
 * Get the default values for the form
 * @param course The course to get the default values from
 * @returns The default values for the form
 */
export const getDefaultValues = (course: CourseForEdit): CourseDetailsValues => ({
    title: course.title,
    shortDescription: course.short_description ?? "",
    description: course.description ?? "",
    thumbnailUrl: course.thumbnail_url ?? "",
    language: COURSE_LANGUAGES.find((language) => language === course.language) ?? "English",
    level: course.level,
    learningOutcomes: course.learning_outcomes,
    requirements: course.requirements,
    categoryIds: course.categoryIds,
    tags: course.tags,
    prerequisiteIds: course.prerequisites.map((prerequisite) => prerequisite.id),
});

/**
 * Move one item of a list to another place → a NEW list (the old one doesn't change).
 * Used after a drag in the Curriculum tab.
 *   moveItem(["a", "b", "c"], 0, 2) → ["b", "c", "a"]
 */
export const moveItem = <T,>(list: T[], fromIndex: number, toIndex: number): T[] => {
    const updated = [...list];
    const [movedItem] = updated.splice(fromIndex, 1); // take it out
    updated.splice(toIndex, 0, movedItem); // put it in its new place
    return updated;
};

// The Cloudinary public_id of a lesson video: one fixed name per lesson
//   getLessonVideoPublicId("abc") → "eduway/lessons/abc"
export const getLessonVideoPublicId = (lessonId: string) => `${LESSON_VIDEO_FOLDER}/${lessonId}`;

// The Cloudinary address of a lesson video and of a picture from it (for the video preview).
// version (video_version) changes with every upload → the browser never shows an old video after "Replace".
//   getLessonVideoUrl("abc", 1792908224512)       → "https://res.cloudinary.com/<cloud>/video/upload/v1792908224512/eduway/lessons/abc.mp4"
//   getLessonVideoThumbnailUrl("abc", 1792908224512) → the same video, the picture at second 1, as a .jpg
const CLOUDINARY_VIDEO_BASE = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`;

export const getLessonVideoUrl = (lessonId: string, version: number | null) =>
    `${CLOUDINARY_VIDEO_BASE}/v${version ?? 1}/${getLessonVideoPublicId(lessonId)}.mp4`;

export const getLessonVideoThumbnailUrl = (lessonId: string, version: number | null) =>
    `${CLOUDINARY_VIDEO_BASE}/so_1/v${version ?? 1}/${getLessonVideoPublicId(lessonId)}.jpg`;
