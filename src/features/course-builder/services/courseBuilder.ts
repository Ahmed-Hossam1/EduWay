import { apiClient } from "@/lib/axios/apiClient";
import { CreateCourseValues } from "../schemas/createCourseSchema";
import { CourseDetailsValues } from "../schemas/courseDetailsSchema";
import { CoursePricingValues } from "../schemas/coursePricingSchema";
import { PublishResult } from "../types";

// The browser talks to /api/courses/... (the routes check the user and call the database)

// POST /api/courses → the id of the new draft
export const createCourseService = async (values: CreateCourseValues): Promise<string> => {
    const response = await apiClient.post<{ courseId: string }>("/courses", values);
    return response.courseId;
};

type UpdateDetailsVariables = { courseId: string; values: CourseDetailsValues };

// PATCH /api/courses/:courseId/details
export const updateCourseDetailsService = async ({ courseId, values }: UpdateDetailsVariables) => {
    return await apiClient.patch<{ message: string }>(`/courses/${courseId}/details`, values);
};

type UpdatePricingVariables = { courseId: string; values: CoursePricingValues };

// PATCH /api/courses/:courseId/pricing
export const updateCoursePricingService = async ({ courseId, values }: UpdatePricingVariables) => {
    return await apiClient.patch<{ message: string }>(`/courses/${courseId}/pricing`, values);
};

// POST /api/courses/:courseId/publish
export const publishCourseService = async (courseId: string) => {
    return await apiClient.post<PublishResult>(`/courses/${courseId}/publish`);
};
