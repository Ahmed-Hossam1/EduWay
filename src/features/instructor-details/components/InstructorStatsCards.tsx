import { use } from "react";
import { BookOpen, Star, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { InstructorStats } from "../types";
import { formatInstructorStats } from "../utils/format";

type InstructorStatsCardsProps = {
    statsPromise: Promise<InstructorStats>;
};

// Numbers come from the teacher's courses → streamed with <Suspense>
export function InstructorStatsCards({ statsPromise }: InstructorStatsCardsProps) {
    const stats = formatInstructorStats(use(statsPromise));

    const items = [
        { icon: BookOpen, value: stats.courses, label: "Courses" },
        { icon: Users, value: stats.students, label: "Students" },
        { icon: Star, value: stats.rating, label: `Rating (${stats.ratings})` },
    ];

    return (
        <div className="grid grid-cols-3 gap-3">
            {items.map((item) => (
                <Card key={item.label} className="gap-1 rounded-2xl p-4 text-center">
                    <item.icon className="mx-auto size-5 text-primary" />
                    <p className="mt-1 text-xl font-black text-foreground sm:text-2xl">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                </Card>
            ))}
        </div>
    );
}
