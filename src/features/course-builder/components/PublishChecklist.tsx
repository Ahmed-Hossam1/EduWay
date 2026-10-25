import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PUBLISH_CHECKLIST } from "../data/editTabs";
import { CourseForEdit } from "../types";
import { getEditHref } from "../utils";

type PublishChecklistProps = {
    course: CourseForEdit;
};

// What the course needs before it can be published (the database says what is missing: course.missing)
export function PublishChecklist({ course }: PublishChecklistProps) {
    const doneCount = PUBLISH_CHECKLIST.filter((item) => !course.missing.includes(item.key)).length;

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle className="text-base font-bold">Publish checklist</CardTitle>
                <p className="text-xs text-muted-foreground">
                    {doneCount} of {PUBLISH_CHECKLIST.length} done
                </p>
            </CardHeader>

            <CardContent>
                <ul className="space-y-2.5">
                    {PUBLISH_CHECKLIST.map((item) => {
                        const isDone = !course.missing.includes(item.key);
                        const Icon = isDone ? CheckCircle2 : Circle;

                        return (
                            <li key={item.key}>
                                <Link
                                    href={getEditHref(course.id, item.tab)}
                                    className={cn(
                                        "flex items-center gap-2 text-sm",
                                        isDone ? "text-muted-foreground line-through" : "text-foreground hover:text-primary",
                                    )}
                                >
                                    <Icon
                                        className={cn("size-4 shrink-0", isDone ? "text-emerald-600" : "text-muted-foreground")}
                                    />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </CardContent>
        </Card>
    );
}
