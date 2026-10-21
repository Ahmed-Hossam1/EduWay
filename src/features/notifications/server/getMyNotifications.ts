import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MyNotifications, NotificationType } from "../types";

// How many notifications the bell shows
const LATEST_COUNT = 10;

/**
 * Server only: the latest notifications of the logged-in user + how many are unread.
 * RLS returns only his own rows.
 */
export const getMyNotifications = async (): Promise<MyNotifications> => {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { items: [], unreadCount: 0 };

    // 1- the latest ones (newest first)
    const { data, error } = await supabase
        .from("notifications")
        .select("id, type, title, link, read_at, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(LATEST_COUNT);

    if (error) throw error;

    // 2- how many are unread (count only, no rows → head: true)
    const { count, error: countError } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .is("read_at", null);

    if (countError) throw countError;

    // database names (read_at) → our names (readAt)
    const items = data.map((row) => ({
        id: row.id,
        type: row.type as NotificationType,
        title: row.title,
        link: row.link,
        readAt: row.read_at,
        createdAt: row.created_at,
    }));

    return { items, unreadCount: count ?? 0 };
};
