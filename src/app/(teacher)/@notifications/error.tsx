"use client";

import { useEffect } from "react";
import { BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type NotificationsErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

// The notifications failed → ONLY the bell shows it (a click tries again), the dashboard keeps working
export default function NotificationsError({ error, reset }: NotificationsErrorProps) {
    useEffect(() => {
        console.error("Notifications error:", error);
    }, [error]);

    return (
        <Button
            variant="ghost"
            size="icon"
            rounded="full"
            className="text-muted-foreground"
            aria-label="Couldn't load notifications. Try again"
            title="Couldn't load notifications. Click to try again"
            onClick={() => reset()}
        >
            <BellOff className="size-5" />
        </Button>
    );
}
