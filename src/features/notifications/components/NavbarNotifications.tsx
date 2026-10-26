"use client";

import { useMyNotifications } from "../hooks/useMyNotifications";
import { NotificationsBell } from "./NotificationsBell";
import { NotificationsBellSkeleton } from "./NotificationsBellSkeleton";

// The bell in the site navbar (logged-in users only): skeleton while loading, then the same bell as the dashboard
export function NavbarNotifications() {
    const { data: notifications, isPending } = useMyNotifications();

    if (isPending) return <NotificationsBellSkeleton />;
    if (!notifications) return null; // failed → no bell (the rest of the navbar still works)

    return <NotificationsBell notifications={notifications} />;
}
