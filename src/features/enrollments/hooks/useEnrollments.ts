"use client"
import { useAppQuery } from "@/hooks/useAppQuery";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { getEnrollmentIdsService } from "../services/enrollments";

export const enrollmentsQueryKey = ["enrollments"];

/**
 * The ids of the courses the user owns.
 * Used to switch the course page buttons to "Go to course".
 * Guests don't send any request (enabled: false).
 */
export const useEnrollments = () => {
    const { data: profile } = useProfile();

    return useAppQuery(enrollmentsQueryKey, getEnrollmentIdsService, {
        enabled: !!profile,
        staleTime: 5 * 60 * 1000,
    });
};
