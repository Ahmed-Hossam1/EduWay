"use client";

import { MouseEvent, useState } from "react";
import Link from "next/link";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, timeAgo } from "@/lib/utils";
import { MyNotifications } from "../types";
import { notificationIcons } from "../data/notificationIcons";
import { useMarkAllRead } from "../hooks/useMarkAllRead";
import { useMarkRead } from "../hooks/useMarkRead";

type NotificationsBellProps = {
    notifications: MyNotifications;
};

// The bell in the dashboard navbar: the red count + a popover with the latest notifications
export function NotificationsBell({ notifications }: NotificationsBellProps) {
    const { items, unreadCount } = notifications;
    const { mutate: markAllRead, isPending } = useMarkAllRead();
    const { mutate: markRead, mutateAsync: markReadAsync } = useMarkRead();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
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
                            {isPending ? (
                                "Saving..."
                            ) : (
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

                            // a click → the notification becomes read + the bell closes (the link opens its page)
                            const openNotification = () => {
                                if (isUnread) markRead(item.id);
                                setIsOpen(false);
                            };

                            // a /learn link → a FULL page load (not <Link>): on "My courses" the "View as student"
                            // modal catches every /learn <Link> (intercepting route), a notification must open the
                            // real lesson page. The page reloads → save "read" first, then go.
                            // (the link comes from item.link: after "await", React has cleared event.currentTarget)
                            const openLearnNotification = async (event: MouseEvent<HTMLAnchorElement>) => {
                                event.preventDefault();
                                const link = item.link ?? "/";
                                try {
                                    if (isUnread) await markReadAsync(item.id);
                                } finally {
                                    window.location.assign(link);
                                }
                            };
                            const isLearnLink = item.link?.startsWith("/learn/");

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
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {timeAgo(item.createdAt)}
                                        </p>
                                    </div>
                                    {isUnread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                                </div>
                            );

                            return (
                                <li key={item.id} className="border-b border-border last:border-0">
                                    {item.link && isLearnLink && (
                                        <a href={item.link} onClick={openLearnNotification}>
                                            {row}
                                        </a>
                                    )}
                                    {item.link && !isLearnLink && (
                                        <Link href={item.link} onClick={openNotification}>
                                            {row}
                                        </Link>
                                    )}
                                    {!item.link && (
                                        <button type="button" className="w-full text-left" onClick={openNotification}>
                                            {row}
                                        </button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </PopoverContent>
        </Popover>
    );
}
