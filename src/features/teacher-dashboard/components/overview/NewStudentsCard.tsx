import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NewStudent } from "../../types";
import { cardHover } from "../../utils/cardStyles";
import { use } from "react";

type NewStudentsCardProps = {
    studentsPromise: Promise<NewStudent[]>;
};

// The latest students who joined the teacher's courses
export function NewStudentsCard({ studentsPromise }: NewStudentsCardProps) {
    const students = use(studentsPromise);

    return (
        <Card className={cn(cardHover, "sm:col-span-2")}>
            <CardHeader>
                <CardTitle className="font-bold">New students</CardTitle>
            </CardHeader>

            <CardContent>
                {/* a new teacher: no students yet */}
                {students.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">No students yet. Share your courses!</p>
                )}

                <ul>
                    {students.map((student) => (
                        <li key={student.id} className="flex items-center gap-3 border-t border-border py-2.5">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                {student.initials}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{student.name}</p>
                                <p className="truncate text-xs text-muted-foreground">{student.courseTitle}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{student.timeAgo}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
