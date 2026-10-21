import { NotificationsBellSkeleton } from "@/features/notifications/components/NotificationsBellSkeleton";

// While the notifications load, ONLY the bell waits (the sidebar + the page are already there)
export default function NotificationsLoading() {
    return <NotificationsBellSkeleton />;
}
