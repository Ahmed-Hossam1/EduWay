import {
    COURSE_LANGUAGES,
    COURSE_PREVIEW_FOLDER,
    COURSE_THUMBNAIL_FOLDER,
    LESSON_POSTER_FOLDER,
    LESSON_VIDEO_FOLDER,
} from "../constants";
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

// The Cloudinary public_id of a lesson poster: one fixed name per lesson too
//   getLessonPosterPublicId("abc") → "eduway/lesson-posters/abc"
export const getLessonPosterPublicId = (lessonId: string) => `${LESSON_POSTER_FOLDER}/${lessonId}`;

// The Cloudinary public_id of a NEW course image (a new name every upload, see COURSE_THUMBNAIL_FOLDER)
//   getCourseThumbnailPublicId("abc") → "eduway/course-thumbnails/abc-1793468535123"
export const getCourseThumbnailPublicId = (courseId: string) => `${COURSE_THUMBNAIL_FOLDER}/${courseId}-${Date.now()}`;

// The Cloudinary public_id of a course preview video: one fixed name per course
//   getCoursePreviewPublicId("abc") → "eduway/course-previews/abc"
export const getCoursePreviewPublicId = (courseId: string) => `${COURSE_PREVIEW_FOLDER}/${courseId}`;

// A picture from a lesson video (the preview, when the teacher has no poster). The video itself is played
// ONLY from its HLS link (hls_url), never from the uploaded MP4.
// version (video_version) changes with every upload → the browser never shows an old picture after "Replace".
//   getLessonVideoThumbnailUrl("abc", 1792908224512) → the picture at second 1 of the video, as a .jpg
const CLOUDINARY_VIDEO_BASE = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`;

export const getLessonVideoThumbnailUrl = (lessonId: string, version: number | null) =>
    `${CLOUDINARY_VIDEO_BASE}/so_1/v${version ?? 1}/${getLessonVideoPublicId(lessonId)}.jpg`;
