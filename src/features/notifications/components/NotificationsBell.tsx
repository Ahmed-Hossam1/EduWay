"use client";

import Link from "next/link";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, timeAgo } from "@/lib/utils";
import { MyNotifications } from "../types";
import { notificationIcons } from "../data/notificationIcons";
import { useMarkAllRead } from "../hooks/useMarkAllRead";

type NotificationsBellProps = {
    notifications: MyNotifications;
};

// The bell in the dashboard navbar: the red count + a popover with the latest notifications
export function NotificationsBell({ notifications }: NotificationsBellProps) {
    const { items, unreadCount } = notifications;
    const { mutate: markAllRead, isPending } = useMarkAllRead();

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        rounded="full"
                        className="relative text-muted-foreground hover:text-foreground"
                        aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"}
                    />
                }
            >
                <Bell className="size-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white tabular-nums">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 gap-0 p-0">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">Notifications</p>
                    {unreadCount > 0 && (
                        <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            isLoading={isPending}
                            onClick={() => markAllRead()}
                        >
                            {isPending ? "Saving..." : (
                                <>
                                    <CheckCheck className="size-3.5" />
                                    Mark all read
                                </>
                            )}
                        </Button>
                    )}
                </div>

                {/* Empty */}
                {items.length === 0 && (
                    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-muted-foreground">
                        <BellOff className="size-6" />
                        <p className="text-sm">You&apos;re all caught up</p>
                    </div>
                )}

                {/* The list (unread ones have a purple dot + bold title) */}
                {items.length > 0 && (
                    <ul className="max-h-96 overflow-y-auto">
                        {items.map((item) => {
                            const Icon = notificationIcons[item.type];
                            const isUnread = item.readAt === null;

                            const row = (
                                <div className="flex gap-3 px-4 py-3 transition-colors hover:bg-muted/60">
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Icon className="size-4" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={cn(
                                                "text-sm leading-snug text-foreground",
                                                isUnread ? "font-semibold" : "text-muted-foreground",
                                            )}
                                        >
                                            {item.title}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(item.createdAt)}</p>
                                    </div>
                                    {isUnread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                                </div>
                            );

                            return (
                                <li key={item.id} className="border-b border-border last:border-0">
                                    {item.link ? <Link href={item.link}>{row}</Link> : row}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </PopoverContent>
        </Popover>
    );
}
