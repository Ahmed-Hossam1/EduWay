import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { DashboardCard } from "./DashboardCard";
import { EarningsOverview, OverviewStats } from "../../types";
import { formatMoney } from "@/lib/format";
import { ChangePill } from "./ChangePill";

type StatsCardsProps = {
    statsPromise: Promise<OverviewStats>;
    earningsPromise: Promise<EarningsOverview>; // the SAME promise as the chart → no extra call
};

// The 4 cards on top: earnings, new students, courses, enrollments this week (purple)
export function StatsCards({ statsPromise, earningsPromise }: StatsCardsProps) {
    const stats = use(statsPromise); // waits inside the <Suspense> of TeacherOverview
    const earnings = use(earningsPromise);

    // the last month of the list = this month
    const thisMonth = earnings.months[earnings.months.length - 1]?.value ?? 0;
    const monthValues = earnings.months.map((month) => month.value);
    const maxMonth = Math.max(...monthValues, 1); // 1 → no dividing by 0 when everything is 0

    return (
        <>
            {/* Earnings this month + small bars (the last 6 months) */}
            <DashboardCard>
                <CardHeader>
                    <CardDescription>Earnings this month</CardDescription>
                    <CardAction>
                        <ChangePill value={earnings.revenueChange} />
                    </CardAction>
                </CardHeader>
                <CardContent className="flex items-end justify-between gap-3">
                    <p className="text-2xl font-black tracking-tight">{formatMoney(thisMonth, "USD", 0)}</p>
                    <div className="flex h-8 items-end gap-1">
                        {monthValues.map((value, index) => (
                            <span
                                key={index}
                                className="w-1.5 rounded-sm bg-primary/30 last:bg-primary"
                                style={{ height: `${Math.max(8, (value / maxMonth) * 100)}%` }}
                            />
                        ))}
                    </div>
                </CardContent>
            </DashboardCard>

            {/* New students (last 30 days vs the 30 days before) */}
            <DashboardCard>
                <CardHeader>
                    <CardDescription>New students</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-black tracking-tight">{stats.studentsLast30Days}</p>
                    <p className="text-xs text-muted-foreground">
                        Last 30 days · {stats.studentsPrevious30Days} the 30 days before
                    </p>
                </CardContent>
            </DashboardCard>

            {/* Courses */}
            <DashboardCard>
                <CardHeader>
                    <CardDescription>Courses</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-black tracking-tight">{stats.totalCourses}</p>
                    <p className="text-xs text-muted-foreground">
                        {stats.publishedCourses} published · {stats.draftCourses} drafts
                    </p>
                </CardContent>
            </DashboardCard>

            {/* Enrollments this week (the purple card) */}
            <DashboardCard className="bg-primary text-primary-foreground ring-0">
                <CardHeader>
                    <CardDescription className="text-primary-foreground/80">Enrollments this week</CardDescription>
                    <CardAction>
                        <Badge className="bg-primary-foreground/20 text-primary-foreground">● Live</Badge>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-black tracking-tight">{stats.enrollmentsThisWeek}</p>
                    <p className="text-xs text-primary-foreground/80">Last 7 days</p>
                </CardContent>
            </DashboardCard>
        </>
    );
}
