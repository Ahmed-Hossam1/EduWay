import { apiClient } from "@/lib/axios/apiClient";
import { LessonValues } from "../schemas/curriculumSchemas";
import { CurriculumLesson, CurriculumSection } from "../types";

// The browser talks to /api/courses/:courseId/sections, /api/sections/..., /api/lessons/...

// ---------- sections ----------

// POST /api/courses/:courseId/sections → the new section
export const addSectionService = async ({ courseId, title }: { courseId: string; title: string }) => {
    return await apiClient.post<CurriculumSection>(`/courses/${courseId}/sections`, { title });
};

// PATCH /api/sections/:sectionId
export const renameSectionService = async ({ sectionId, title }: { sectionId: string; title: string }) => {
    return await apiClient.patch<{ message: string }>(`/sections/${sectionId}`, { title });
};

// DELETE /api/sections/:sectionId
export const deleteSectionService = async (sectionId: string) => {
    return await apiClient.delete<{ message: string }>(`/sections/${sectionId}`);
};

// PATCH /api/courses/:courseId/sections → the section ids in the new order
export const reorderSectionsService = async ({ courseId, ids }: { courseId: string; ids: string[] }) => {
    return await apiClient.patch<{ message: string }>(`/courses/${courseId}/sections`, { ids });
};

// ---------- lessons ----------

// POST /api/sections/:sectionId/lessons → the new lesson
export const addLessonService = async ({ sectionId, title }: { sectionId: string; title: string }) => {
    return await apiClient.post<CurriculumLesson>(`/sections/${sectionId}/lessons`, { title });
};

// PATCH /api/lessons/:lessonId
export const updateLessonService = async ({ lessonId, values }: { lessonId: string; values: LessonValues }) => {
    return await apiClient.patch<{ message: string }>(`/lessons/${lessonId}`, values);
};

// DELETE /api/lessons/:lessonId
export const deleteLessonService = async (lessonId: string) => {
    return await apiClient.delete<{ message: string }>(`/lessons/${lessonId}`);
};

// PATCH /api/sections/:sectionId/lessons → the lesson ids of the section in the new order
export const reorderLessonsService = async ({ sectionId, ids }: { sectionId: string; ids: string[] }) => {
    return await apiClient.patch<{ message: string }>(`/sections/${sectionId}/lessons`, { ids });
};

// ---------- lesson videos ----------

// PUT /api/lessons/:lessonId/video  { publicId } → the video is on Cloudinary: save it for the lesson
export const saveLessonVideoService = async ({ lessonId, publicId }: { lessonId: string; publicId: string }) => {
    return await apiClient.put<{ message: string; durationSeconds: number }>(`/lessons/${lessonId}/video`, {
        publicId,
    });
};

// DELETE /api/lessons/:lessonId/video
export const removeLessonVideoService = async (lessonId: string) => {
    return await apiClient.delete<{ message: string }>(`/lessons/${lessonId}/video`);
};
