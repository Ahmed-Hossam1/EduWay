import { BarChart3, BookOpen, Clock, Globe, Layers } from "lucide-react";
import { CoursePurchaseActions } from "@/features/enrollments/components/CoursePurchaseActions";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDuration, formatPrice } from "@/features/courses/utils/format";
import { CourseDetails } from "../types";

type CoursePurchaseCardProps = {
    course: CourseDetails;
};

// Enroll (free), Cart and Wishlist work — paying for a course comes with the checkout
export function CoursePurchaseCard({ course }: CoursePurchaseCardProps) {
    const { price, currency, level, duration_seconds, lessons_count, sections, language } = course;
    const isFree = price === 0;
    // "beginner" => "Beginner"
    const levelLabel = level.charAt(0).toUpperCase() + level.slice(1);

    // Course content details come from the database
    const includes = [
        { icon: Clock, text: `${formatDuration(duration_seconds)} of on-demand content` },
        { icon: BookOpen, text: `${lessons_count} lessons` },
        { icon: Layers, text: `${sections.length} sections` },
        { icon: BarChart3, text: `${levelLabel} level` },
        { icon: Globe, text: language },
    ];

    return (
        <Card className="rounded-2xl shadow-lg">
            <CardHeader>
                <p className="text-3xl font-black tracking-tight text-foreground">{formatPrice(price, currency)}</p>
                {isFree && <p className="text-sm text-muted-foreground">Enroll for free and start learning now.</p>}
            </CardHeader>

            <CardContent className="space-y-2.5">
                <CoursePurchaseActions courseId={course.id} price={price} />
            </CardContent>

            <Separator />

            <CardFooter className="flex-col items-start gap-3 border-t-0 bg-transparent">
                <p className="text-sm font-semibold text-foreground">This course includes:</p>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                    {includes.map((item) => (
                        <li key={item.text} className="flex items-center gap-2.5">
                            <item.icon className="size-4 shrink-0 text-primary" />
                            {item.text}
                        </li>
                    ))}
                </ul>
            </CardFooter>
        </Card>
    );
}
