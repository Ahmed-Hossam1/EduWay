import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseReviewsSection } from "@/features/reviews/components/CourseReviewsSection";
import { CourseReviewsSkeleton } from "@/features/reviews/components/skeleton";
import { LessonPlayer } from "../types";
import { LessonOverview } from "./LessonOverview";

type LessonTabsProps = {
    player: LessonPlayer;
};

// The tabs under the video: Overview + Reviews (more tabs later: Q&A, Notes...)
export function LessonTabs({ player }: LessonTabsProps) {
    const { course, lesson, progress, isEnrolled } = player;

    return (
        <Tabs defaultValue="overview" className="gap-6">
            <TabsList variant="line" className="w-full justify-start border-b border-border">
                <TabsTrigger value="overview" className="flex-none px-3">
                    Overview
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-none px-3">
                    Reviews
                </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
                <LessonOverview course={course} lesson={lesson} progress={progress} showProgress={isEnrolled} />
            </TabsContent>

            {/* the same reviews section as the course page (the student can rate without leaving the lesson) */}
            <TabsContent value="reviews">
                <Suspense fallback={<CourseReviewsSkeleton />}>
                    <CourseReviewsSection courseId={course.id} />
                </Suspense>
            </TabsContent>
        </Tabs>
    );
}
