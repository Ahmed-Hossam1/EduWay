"use client"
import { useUserIdsQuery } from "@/hooks/useUserIdsQuery";
import { getEnrollmentIdsService } from "../services/enrollments";

export const enrollmentsQueryKey = ["enrollments"];

/**
 * The ids of the courses the user owns.
 * Used to switch the course page buttons to "Go to course".
 */
export const useEnrollments = () => useUserIdsQuery(enrollmentsQueryKey, getEnrollmentIdsService);
