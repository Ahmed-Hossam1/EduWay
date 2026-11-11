import { apiClient } from "@/lib/axios/apiClient";
import { TeacherProfileValues } from "../schemas/teacherProfileSchema";

export const updateTeacherProfileService = async (values: TeacherProfileValues) => {
    return await apiClient.patch<{ message: string }>("/profile", values);
};
