"use client";

import Link from "next/link";
import { CheckCircle2, ExternalLink, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/features/courses/utils/format";
import { usePublishCourse } from "../../hooks/usePublishCourse";
import { CourseForEdit } from "../../types";

type CoursePublishPanelProps = {
    course: CourseForEdit;
};

// The Publish tab: live already / ready to publish / still missing something (the checklist on the right)
export function CoursePublishPanel({ course }: CoursePublishPanelProps) {
    const { mutate: publish, isPending } = usePublishCourse();

    const isPublished = course.status === "published";
    const isReady = course.missing.length === 0;

    // 1- Already live
    if (isPublished) {
        return (
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-bold">
                        <CheckCircle2 className="size-5 text-emerald-600" />
                        Your course is live
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <p>
                        Students can find it and enroll. You can still edit the details and the price: the changes show
                        on the site right after you save.
                    </p>
                    <p>To hide it from new students, use &quot;Unpublish&quot; in the course menu on My courses.</p>
                    <Button asChild variant="outline">
                        <Link href={`/courses/${course.slug}`} target="_blank">
                            <ExternalLink />
                            Open the course page
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // 2- A draft: ready or not
    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle className="text-base font-bold">Publish your course</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                {isReady ? (
                    <p className="text-muted-foreground">
                        Everything is ready. After publishing, students can find your course and{" "}
                        {course.price === 0 ? "enroll for free" : `buy it for ${formatPrice(course.price, course.currency)}`}.
                    </p>
                ) : (
                    <p className="text-muted-foreground">
                        Finish the publish checklist first ({course.missing.length} left). Click an item to go to it.
                    </p>
                )}

                <Button
                    size="lg"
                    rounded="xl"
                    className="h-11"
                    isLoading={isPending}
                    disabled={!isReady}
                    onClick={() => publish(course.id)}
                >
                    {isPending ? (
                        "Publishing..."
                    ) : (
                        <>
                            <Rocket />
                            Publish course
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
