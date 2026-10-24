import { NotificationsBellSkeleton } from "@/features/notifications/components/NotificationsBellSkeleton";
import { NotificationsBellWithData } from "@/features/notifications/components/NotificationsBellWithData";
import { Suspense } from "react";

/**
 * The @notifications slot (a parallel route): the bell in the dashboard navbar.
 *
 * Why default.tsx and not page.tsx?
 *   A slot looks for a file with the SAME path as the URL (/teacher/courses → @notifications/teacher/courses/page.tsx).
 *   It doesn't exist → after a refresh the whole page would be a 404.
 *   default.tsx = "use me for every URL" → one file for all the dashboard pages.
 *
 * Why <Suspense> here and not a loading.tsx?
 *   loading.tsx only wraps a slot's page.tsx, NOT its default.tsx → it never showed,
 *   and the WHOLE dashboard waited for the notifications.
 *   With <Suspense> the page shows right away and only the bell waits (skeleton → bell).
 *
 * error.tsx still works: if the notifications fail, only the bell shows the problem.
 */
export default function NotificationsSlot() {
    return (
        <Suspense fallback={<NotificationsBellSkeleton />}>
            <NotificationsBellWithData />
        </Suspense>
    );
}

