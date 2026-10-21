import "server-only";
import { OverviewInsight } from "../types";
import { getTeacherEnrollments } from "./base/getTeacherEnrollments";
import { daysAgo } from "../utils/dates";
import { percentChange } from "../utils/percentChange";

// One sentence: enrollments of the last 30 days vs the 30 days before
export async function getOverviewInsight(teacherId: string): Promise<OverviewInsight> {
    const enrollments = await getTeacherEnrollments(teacherId);

    const thirtyDaysAgo = daysAgo(30);
    const sixtyDaysAgo = daysAgo(60);

    const last30 = enrollments.filter((enrollment) => new Date(enrollment.enrolled_at) >= thirtyDaysAgo).length;
    const before30 = enrollments.filter((enrollment) => {
        const date = new Date(enrollment.enrolled_at);
        return date < thirtyDaysAgo && date >= sixtyDaysAgo;
    }).length;

    // nothing to compare with yet → just say how many
    if (before30 === 0) {
        return {
            trend: "up",
            text: `${last30} ${last30 === 1 ? "student" : "students"} joined your courses in the last 30 days.`,
        };
    }

    const change = percentChange(last30, before30);
    const trend = change >= 0 ? "up" : "down";

    return {
        trend,
        text: `Enrollments are ${trend} ${Math.abs(change)}% vs the 30 days before.`,
    };
}
