"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CardContent } from "@/components/ui/card";
import { DashboardCard } from "./DashboardCard";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { UserAvatar } from "@/features/profile/components/UserAvatar";
import { getFullName } from "@/lib/format";
import { OverviewStats } from "../../types";

type TeacherProfileCardProps = {
    statsPromise: Promise<OverviewStats>; // the SAME promise as the stats cards → no extra query
};

/**
 * The teacher card, from 2 places:
 *   name + photo + headline → useProfile()  (React Query: updates by itself after Profile settings)
 *   courses + new students  → statsPromise  (server, the same data as the stats cards)
 */
export function TeacherProfileCard({ statsPromise }: TeacherProfileCardProps) {
    const stats = use(statsPromise); // waits inside the <Suspense> of TeacherOverview
    const { data: profile, isPending } = useProfile();

    const fullName = getFullName(profile?.first_name, profile?.last_name, "Teacher");
    const numbers = [
        { label: "Courses", value: String(stats.totalCourses) },
        { label: "New students", value: String(stats.studentsLast30Days) }, // the last 30 days
        { label: "Rating", value: "—" }, // TODO: when reviews exist
    ];

    return (
        <DashboardCard>
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
        </DashboardCard>
    );
}
