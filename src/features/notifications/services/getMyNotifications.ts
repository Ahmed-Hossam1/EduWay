import { apiClient } from "@/lib/axios/apiClient";
import { MyNotifications } from "../types";

// GET /api/notifications → the latest notifications + the unread count
export const getMyNotificationsService = async () => {
    return await apiClient.get<MyNotifications>("/notifications");
};
