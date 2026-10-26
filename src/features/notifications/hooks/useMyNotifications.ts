"use client";

import { useAppQuery } from "@/hooks/useAppQuery";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { getMyNotificationsService } from "../services/getMyNotifications";

export const notificationsQueryKey = ["notifications"];

const ONE_MINUTE = 60 * 1000;

/**
 * The notifications of the bell in the SITE navbar (students: "Omar replied to your comment").
 * (The teacher dashboard gets them from the server: the @notifications slot.)
 * Guests don't send any request (enabled: false).
 */
export const useMyNotifications = () => {
    const { data: profile } = useProfile();

    return useAppQuery(notificationsQueryKey, getMyNotificationsService, {
        enabled: !!profile,
        staleTime: ONE_MINUTE, // a new reply should show without waiting too long
        gcTime: ONE_MINUTE,
    });
};
