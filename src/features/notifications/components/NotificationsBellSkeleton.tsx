import { Bell } from "lucide-react";

// While the notifications load: the bell without a count + a small pulsing dot
export function NotificationsBellSkeleton() {
    return (
        <span
            aria-label="Loading notifications"
            className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground"
        >
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-2 animate-pulse rounded-full bg-muted-foreground/40" />
        </span>
    );
}
