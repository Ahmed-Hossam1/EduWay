import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CourseOwnerNoticeProps = {
    compact?: boolean; // the small mobile bar → only the button
    className?: string;
};

// Shown to the teacher on HIS course page instead of "Buy / Add to cart" (he can't buy his own course)
export function CourseOwnerNotice({ compact = false, className }: CourseOwnerNoticeProps) {
    return (
        <div className={cn("space-y-2.5", className)}>
            {!compact && (
                <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
                    You&apos;re the instructor of this course
                </p>
            )}
            <Button size="lg" rounded="xl" className="h-11 w-full font-semibold" asChild>
                <Link href="/teacher/dashboard">
                    <LayoutDashboard />
                    Go to dashboard
                </Link>
            </Button>
        </div>
    );
}
