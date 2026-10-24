import { use } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "./DashboardCard";
import { timeAgo } from "@/lib/utils";
import { getFullName } from "@/lib/format";
import { UserAvatar } from "@/features/profile/components/UserAvatar";
import { NewStudent } from "../../types";

type NewStudentsCardProps = {
    studentsPromise: Promise<NewStudent[]>;
};

// The latest students who joined the teacher's courses
export function NewStudentsCard({ studentsPromise }: NewStudentsCardProps) {
    const students = use(studentsPromise); // waits inside the <Suspense> of TeacherOverview

    return (
        <DashboardCard className="sm:col-span-2">
            <CardHeader>
                <CardTitle className="font-bold">New students</CardTitle>
            </CardHeader>

            <CardContent>
                {/* a new teacher: no students yet */}
                {students.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">No students yet. Share your courses!</p>
                )}

                <ul>
                    {students.map((enrollment) => {
                        const { student } = enrollment;
                        const name = getFullName(student?.first_name, student?.last_name, "A student");

                        return (
                            // unique: one student can join many courses
                            <li
                                key={`${enrollment.user_id}-${enrollment.course_id}`}
                                className="flex items-center gap-3 border-t border-border py-2.5"
                            >
                                <UserAvatar
                                    firstName={student?.first_name ?? null}
                                    lastName={student?.last_name ?? null}
                                    avatarUrl={student?.avatar_url ?? null}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">{name}</p>
                                    <p className="truncate text-xs text-muted-foreground">{enrollment.course.title}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">{timeAgo(enrollment.enrolled_at)}</span>
                            </li>
                        );
                    })}
                </ul>
            </CardContent>
        </DashboardCard>
    );
}
