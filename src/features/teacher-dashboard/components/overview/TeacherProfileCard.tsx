"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { UserAvatar } from "@/features/profile/components/UserAvatar";
import { OverviewStats } from "../../types";

type TeacherProfileCardProps = {
    statsPromise: Promise<OverviewStats>; // the SAME promise as the stats cards → no extra query
};

/**
 * The teacher card, from 2 places:
 *   name + photo + headline → useProfile()  (React Query: updates by itself after Profile settings)
 *   courses + students      → statsPromise  (server, the same data as the stats cards)
 */
export function TeacherProfileCard({ statsPromise }: TeacherProfileCardProps) {
    const stats = use(statsPromise); // waits inside the <Suspense> of TeacherOverview
    const { data: profile, isPending } = useProfile();

    const fullName = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() || "Teacher";
    const numbers = [
        { label: "Courses", value: String(stats.publishedCourses + stats.draftCourses) },
        { label: "Students", value: stats.totalStudents.toLocaleString("en-US") },
        { label: "Rating", value: "—" }, // TODO: when reviews exist
    ];

    return (
        <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
            <CardContent className="flex flex-col items-center text-center">
                {/* only this part waits for useProfile (instant when it's already cached) */}
                {isPending ? (
                    <>
                        <Skeleton className="size-16 rounded-full" />
                        <Skeleton className="mt-3 h-4 w-28" />
                        <Skeleton className="mt-2 h-3 w-36" />
                    </>
                ) : (
                    <>
                        <span className="rounded-full ring-4 ring-primary/15 [&_[data-slot=avatar]]:size-16">
                            <UserAvatar
                                firstName={profile?.first_name ?? null}
                                lastName={profile?.last_name ?? null}
                                avatarUrl={profile?.avatar_url ?? null}
                                size="lg"
                            />
                        </span>
                        <p className="mt-3 font-bold">{fullName}</p>
                        {profile?.headline && (
                            <p className="line-clamp-1 text-xs text-muted-foreground">{profile.headline}</p>
                        )}
                    </>
                )}

                <div className="mt-4 grid w-full grid-cols-3 gap-2">
                    {numbers.map((number) => (
                        <div key={number.label}>
                            <p className="text-lg font-black">{number.value}</p>
                            <p className="text-[11px] text-muted-foreground">{number.label}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function TeacherProfileCardSkeleton() {
    return (
        <Card className={cn("items-center")}>
            <CardContent className="flex w-full flex-col items-center">
                <Skeleton className="size-16 rounded-full" />
                <Skeleton className="mt-3 h-4 w-28" />
                <Skeleton className="mt-2 h-3 w-36" />
                <div className="mt-4 grid w-full grid-cols-3 gap-2">
                    {[1, 2, 3].map((item) => (
                        <Skeleton key={item} className="h-10" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
