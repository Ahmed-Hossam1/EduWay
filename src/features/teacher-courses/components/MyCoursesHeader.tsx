import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MyCoursesHeader() {
    return (
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 className="text-2xl font-black tracking-tight">My courses</h1>
                <p className="text-sm text-muted-foreground">Manage, edit, and publish your courses.</p>
            </div>

            {/* TODO: the create course page comes next */}
            <Button asChild size="lg">
                <Link href="/teacher/courses/new">
                    <Plus />
                    New course
                </Link>
            </Button>
        </div>
    );
}
