import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/getCurrentUser";
import { MyNotifications } from "../types";

/**
 * Server only: the latest 10 notifications of the logged-in user + how many are unread.
 * The database returns them ready (get_my_notifications): newest first, with the UI names (readAt, createdAt).
 */
export const getMyNotifications = async (): Promise<MyNotifications> => {
    // a guest has no notifications (the database function is for logged-in users only)
    const user = await getCurrentUser();
    if (!user) return { items: [], unreadCount: 0 };

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.rpc("get_my_notifications");

    if (error) throw error;
    return data as MyNotifications;
};
