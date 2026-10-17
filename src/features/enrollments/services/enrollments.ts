import { apiClient } from "@/lib/axios/apiClient";
import { EnrollmentIdsResponse } from "../types";

// The browser talks to /api/enrollments (the route checks the user and calls Supabase)

export const getEnrollmentIdsService = async (): Promise<string[]> => {
    const response = await apiClient.get<EnrollmentIdsResponse>("/enrollments");
    return response.courseIds;
};

export const enrollService = async (courseId: string) => {
    return await apiClient.post("/enrollments", { courseId });
};
