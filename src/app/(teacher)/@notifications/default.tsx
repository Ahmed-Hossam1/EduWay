import { NotificationsBell } from "@/features/notifications/components/NotificationsBell";
import { getMyNotifications } from "@/features/notifications/server/getMyNotifications";

/**
 * The @notifications slot (a parallel route): the bell in the dashboard navbar.
 *
 * Why default.tsx and not page.tsx?
 *   A slot looks for a file with the SAME path as the URL (/teacher/courses → @notifications/teacher/courses/page.tsx).
 *   It doesn't exist → after a refresh the whole page would be a 404.
 *   default.tsx = "use me for every URL" → one file for all the dashboard pages.
 *
 * Its own loading.tsx / error.tsx: if the notifications are slow or fail,
 * only the bell waits / shows the problem, the dashboard keeps working.
 */
export default async function NotificationsSlot() {
    const notifications = await getMyNotifications();

    return <NotificationsBell notifications={notifications} />;
}
