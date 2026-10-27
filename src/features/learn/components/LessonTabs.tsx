import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseQuestionsSection } from "@/features/questions/components/CourseQuestionsSection";
import { CourseQuestionsSkeleton } from "@/features/questions/components/skeleton";
import { CourseReviewsSection } from "@/features/reviews/components/CourseReviewsSection";
import { CourseReviewsSkeleton } from "@/features/reviews/components/skeleton";
import { LessonPlayer, LessonTab } from "../types";
import { LessonOverview } from "./LessonOverview";

type LessonTabsProps = {
    player: LessonPlayer;
    defaultTab?: LessonTab; // ?tab=qa (a notification "replied to your question" opens the Q&A)
};

// The tabs under the video: Overview + Q&A (buyers + the teacher) + Reviews (more tabs later: Notes...)
export function LessonTabs({ player, defaultTab = "overview" }: LessonTabsProps) {
    const { course, lesson, progress, isEnrolled, isOwner } = player;

    // the lesson Q&A is private: a free preview visitor doesn't see the tab
    const canSeeQA = isEnrolled || isOwner;
    const firstTab = defaultTab === "qa" && !canSeeQA ? "overview" : defaultTab;

    return (
        <Tabs defaultValue={firstTab} className="gap-6">
            <TabsList variant="line" className="w-full justify-start border-b border-border">
                <TabsTrigger value="overview" className="flex-none px-3">
                    Overview
                </TabsTrigger>
                {canSeeQA && (
                    <TabsTrigger value="qa" className="flex-none px-3">
                        Q&amp;A
                    </TabsTrigger>
                )}
                <TabsTrigger value="reviews" className="flex-none px-3">
                    Reviews
                </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
                <LessonOverview course={course} lesson={lesson} progress={progress} showProgress={isEnrolled} />
            </TabsContent>

            {/* the questions of THIS lesson (the course page questions stay on the course page) */}
            {canSeeQA && (
                <TabsContent value="qa">
                    <Suspense fallback={<CourseQuestionsSkeleton />}>
                        <CourseQuestionsSection courseId={course.id} lessonId={lesson.id} />
                    </Suspense>
                </TabsContent>
            )}

            {/* the same reviews section as the course page (the student can rate without leaving the lesson) */}
            <TabsContent value="reviews">
                <Suspense fallback={<CourseReviewsSkeleton />}>
                    <CourseReviewsSection courseId={course.id} />
                </Suspense>
            </TabsContent>
        </Tabs>
    );
}
