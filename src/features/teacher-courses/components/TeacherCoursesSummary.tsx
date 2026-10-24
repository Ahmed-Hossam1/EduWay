import { use } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { formatMoney } from "@/features/teacher-dashboard/utils/chart";
import { EarningsOverview, OverviewStats } from "@/features/teacher-dashboard/types";

type TeacherCoursesSummaryProps = {
    statsPromise: Promise<OverviewStats>;
    earningsPromise: Promise<EarningsOverview>;
};

// The 4 numbers on top of the page (the same database functions as the Overview)
export function TeacherCoursesSummary({ statsPromise, earningsPromise }: TeacherCoursesSummaryProps) {
    const stats = use(statsPromise);
    const earnings = use(earningsPromise);

    // get the numbers of courses from fetched data and put it in array of objects to display them in the cards
    const numbers = [
        { label: "Published", value: String(stats.publishedCourses) },
        { label: "Drafts", value: String(stats.draftCourses) },
        { label: "New students (30 days)", value: String(stats.studentsLast30Days) },
        { label: "Total earnings", value: formatMoney(earnings.totalRevenue) },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {numbers.map((number) => (
                <Card key={number.label} size="sm">
                    <CardHeader>
                        <CardDescription>{number.label}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-black tracking-tight">{number.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
