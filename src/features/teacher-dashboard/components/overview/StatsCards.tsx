import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { OverviewStats } from "../../types";
import { formatMoney, toPoints } from "../../utils/chart";

type StatsCardsProps = {
    statsPromise: Promise<OverviewStats>;
};

// The 4 cards on top: earnings, new students, courses, enrollments this week (purple)
export function StatsCards({ statsPromise }: StatsCardsProps) {
    const stats = use(statsPromise); // waits inside the <Suspense> of TeacherOverview
    const maxWeek = Math.max(...stats.earningsByWeek, 1); // 1 → no dividing by 0 when everything is 0

    return (
        <>
            {/* Earnings + small bars */}
            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader>
                    <CardDescription>Earnings this month</CardDescription>
                </CardHeader>
                <CardContent className="flex items-end justify-between gap-3">
                    <p className="text-2xl font-black tracking-tight">{formatMoney(stats.earningsThisMonth)}</p>
                    <div className="flex h-8 items-end gap-1">
                        {stats.earningsByWeek.map((value, index) => (
                            <span
                                key={index}
                                className="w-1.5 rounded-sm bg-primary/30 last:bg-primary"
                                style={{ height: `${Math.max(8, (value / maxWeek) * 100)}%` }}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* New students + small line */}
            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader>
                    <CardDescription>New students</CardDescription>
                </CardHeader>
                <CardContent className="flex items-end justify-between gap-3">
                    <p className="text-2xl font-black tracking-tight">{stats.newStudents}</p>
                    <svg viewBox="0 0 60 28" className="h-7 w-16 overflow-visible" aria-hidden="true">
                        <polyline
                            points={toPoints(stats.studentsTrend, 60, 28)}
                            fill="none"
                            className="stroke-primary"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </CardContent>
            </Card>

            {/* Courses */}
            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader>
                    <CardDescription>Courses</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-black tracking-tight">{stats.publishedCourses + stats.draftCourses}</p>
                    <p className="text-xs text-muted-foreground">
                        {stats.publishedCourses} published · {stats.draftCourses} drafts
                    </p>
                </CardContent>
            </Card>

            {/* Enrollments this week (the purple card) */}
            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 bg-primary text-primary-foreground ring-0">
                <CardHeader>
                    <CardDescription className="text-primary-foreground/80">Enrollments this week</CardDescription>
                    <CardAction>
                        <Badge className="bg-primary-foreground/20 text-primary-foreground">● Live</Badge>
                    </CardAction>
                </CardHeader>
                <CardContent className="flex items-end justify-between gap-3">
                    <p className="text-2xl font-black tracking-tight">{stats.enrollmentsThisWeek}</p>
                    <svg viewBox="0 0 70 28" className="h-7 w-20 overflow-visible" aria-hidden="true">
                        <polyline
                            points={toPoints(stats.enrollmentsTrend, 70, 28)}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </CardContent>
            </Card>
        </>
    );
}
