import "server-only";
import { timeAgo } from "@/lib/utils";
import { NewStudent } from "../types";
import { getTeacherEnrollments } from "./base/getTeacherEnrollments";

// The last 3 students who joined this teacher's courses
export async function getNewStudents(teacherId: string): Promise<NewStudent[]> {
    const enrollments = await getTeacherEnrollments(teacherId); // already newest first

    return enrollments.slice(0, 3).map((enrollment) => {
        const firstName = enrollment.student?.first_name ?? "";
        const lastName = enrollment.student?.last_name ?? "";

        return {
            id: `${enrollment.student?.id}-${enrollment.course_id}`, // one student can join many courses
            name: `${firstName} ${lastName}`.trim() || "A student",
            initials: `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "S",
            courseTitle: enrollment.course?.title ?? "",
            timeAgo: timeAgo(enrollment.enrolled_at),
        };
    });
}
