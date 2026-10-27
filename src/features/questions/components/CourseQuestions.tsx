"use client";

import { useState } from "react";
import { useScrollToComment } from "@/features/comments/hooks/useScrollToComment";
import Link from "next/link";
import { Award, CheckCircle2, MessageCircleQuestion } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CommentItem } from "@/features/comments/components/CommentItem";
import { CommentSortSelect } from "@/features/comments/components/CommentSortSelect";
import { CommentTextForm } from "@/features/comments/components/CommentTextForm";
import { CommentsListSkeleton } from "@/features/comments/components/skeleton";
import { CommentActions, CommentSort } from "@/features/comments/types";
import { useCourseQuestions } from "../hooks/useCourseQuestions";
import { useCreateQuestion } from "../hooks/useCreateQuestion";
import { useDeleteQuestion } from "../hooks/useDeleteQuestion";
import { useMarkBestAnswer } from "../hooks/useMarkBestAnswer";
import { useUpdateQuestion } from "../hooks/useUpdateQuestion";
import { CourseQuestionsPage, QuestionNode } from "../types";

type CourseQuestionsProps = {
    courseId: string;
    lessonId: string | null; // null → the course page questions | id → the questions of this lesson (/learn)
    firstPage: CourseQuestionsPage; // from the server (newest first)
};

/**
 * The Q&A list: "Ask a question", the questions (+ answers), the sort, "Show more questions".
 *   course page (lessonId null) → anyone logged in asks; the teacher + the buyers answer, the asker in his question
 *   a lesson (/learn)           → the buyers + the teacher only
 * The best answer of a question shows first, with a badge.
 */
export function CourseQuestions({ courseId, lessonId, firstPage }: CourseQuestionsProps) {
    const [sort, setSort] = useState<CommentSort>("newest");
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCourseQuestions(
        courseId,
        lessonId,
        sort,
        firstPage,
    );
    const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion();
    const { mutate: updateQuestion, isPending: isUpdatePending } = useUpdateQuestion();
    const { mutate: deleteQuestion, isPending: isDeletePending } = useDeleteQuestion();
    const { mutate: markBestAnswer, isPending: isMarking } = useMarkBestAnswer();

    const { canAsk } = data?.pages[0] ?? firstPage;
    const questions = data?.pages.flatMap((page) => page.questions) ?? [];
    const isLessonQA = lessonId !== null;
    const sectionId = isLessonQA ? "lesson-questions" : "questions";

    // a notification link: ...#question-<id> → that comment (or #questions → the section)
    const focusedId = useScrollToComment("question", sectionId);
    const isReplying = isCreating; // the same request posts questions and answers

    // what every question / answer can do (CommentItem calls them)
    const actions: CommentActions = {
        reply: (parentId, body, onDone) =>
            createQuestion({ courseId, values: { body, lessonId, parentId } }, { onSuccess: onDone }),
        isReplyPending: isReplying,
        update: (questionId, body, onDone) => updateQuestion({ courseId, questionId, body }, { onSuccess: onDone }),
        isUpdatePending,
        remove: (questionId, onDone) => deleteQuestion({ courseId, questionId }, { onSuccess: onDone }),
        isDeletePending,
    };

    // under the name: "Instructor answered" on a question, "Best answer" on an answer
    const renderBadges = (node: QuestionNode, depth: number) => {
        if (depth === 1 && (node.hasBestAnswer || node.answeredByInstructor)) {
            return (
                <div className="mt-1 flex flex-wrap gap-1.5">
                    {node.hasBestAnswer && (
                        <Badge variant="success">
                            <CheckCircle2 />
                            Solved
                        </Badge>
                    )}
                    {node.answeredByInstructor && <Badge variant="outline">Instructor answered</Badge>}
                </div>
            );
        }
        if (node.isBestAnswer) {
            return (
                <Badge variant="success" className="mt-1">
                    <Award />
                    Best answer
                </Badge>
            );
        }
        return null;
    };

    // "Mark as best answer": only on a DIRECT answer (level 2), for the asker or the teacher
    const renderBestButton = (node: QuestionNode, depth: number, question: QuestionNode) => {
        if (depth !== 2 || !question.canMarkBest) return null;

        return (
            <Button
                variant="ghost"
                size="xs"
                className="text-emerald-700 dark:text-emerald-400"
                disabled={isMarking}
                onClick={() => markBestAnswer({ courseId, answerId: node.id, isBest: !node.isBestAnswer })}
            >
                <Award />
                {node.isBestAnswer ? "Remove best answer" : "Mark as best answer"}
            </Button>
        );
    };

    return (
        <section aria-labelledby={sectionId} className="space-y-6">
            <div>
                {/* id="questions" → a notification links here (/courses/<slug>#questions) */}
                <h2 id={sectionId} className="scroll-mt-24 text-2xl font-bold tracking-tight text-foreground">
                    {isLessonQA ? "Questions about this lesson" : "Questions about this course"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {isLessonQA
                        ? "Stuck on something? Ask the instructor and the other students."
                        : "Not sure if this course is for you? Ask the instructor and the students who took it."}
                </p>
            </div>

            {canAsk && (
                <Card className="gap-3 rounded-2xl p-4">
                    <CommentTextForm
                        placeholder={
                            isLessonQA ? "Ask a question about this lesson..." : "Ask a question about this course..."
                        }
                        submitLabel="Ask"
                        isPending={isCreating}
                        rows={3}
                        autoFocus={false}
                        onSubmit={(body, clear) =>
                            createQuestion({ courseId, values: { body, lessonId } }, { onSuccess: clear })
                        }
                    />
                </Card>
            )}

            {/* the course page: a guest logs in first */}
            {!canAsk && !isLessonQA && (
                <Button variant="outline" rounded="full" className="w-fit" asChild>
                    <Link href="/auth/login">
                        <MessageCircleQuestion />
                        Log in to ask a question
                    </Link>
                </Button>
            )}

            {/* no questions yet */}
            {data && questions.length === 0 && (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-4 py-10 text-center">
                    <MessageCircleQuestion className="size-7 text-muted-foreground" />
                    <p className="font-medium text-foreground">No questions yet</p>
                    <p className="text-sm text-muted-foreground">
                        {canAsk ? "Be the first to ask." : "Questions about this course will show here."}
                    </p>
                </div>
            )}

            {(questions.length > 0 || !data) && (
                <div className="space-y-6">
                    <CommentSortSelect value={sort} onChange={setSort} label="Sort questions" />

                    {/* another sort is loading for the first time */}
                    {!data && <CommentsListSkeleton />}

                    <div className="divide-y divide-border">
                        {questions.map((question) => (
                            <div key={question.id} className="py-6 first:pt-0">
                                <CommentItem
                                    node={question}
                                    actions={actions}
                                    canReply={question.canReply ?? false}
                                    topName="question"
                                    focusedId={focusedId}
                                    renderUnderName={renderBadges}
                                    renderActions={renderBestButton}
                                />
                            </div>
                        ))}
                    </div>

                    {hasNextPage && (
                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                rounded="full"
                                isLoading={isFetchingNextPage}
                                onClick={() => fetchNextPage()}
                            >
                                {isFetchingNextPage ? "Loading..." : "Show more questions"}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
