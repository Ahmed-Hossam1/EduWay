"use client";

import { useState } from "react";
import { useScrollToComment } from "@/features/comments/hooks/useScrollToComment";
import { MessageSquareText } from "lucide-react";
import { RatingStars } from "@/components/shared/RatingStars";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CommentItem } from "@/features/comments/components/CommentItem";
import { CommentSortSelect } from "@/features/comments/components/CommentSortSelect";
import { CommentsListSkeleton } from "@/features/comments/components/skeleton";
import { CommentActions, CommentSort } from "@/features/comments/types";
import { useCourseReviews } from "../hooks/useCourseReviews";
import { useCreateReview } from "../hooks/useCreateReview";
import { useDeleteReview } from "../hooks/useDeleteReview";
import { useReplyToReview } from "../hooks/useReplyToReview";
import { useUpdateReview } from "../hooks/useUpdateReview";
import { CourseReviewsPage, ReviewNode } from "../types";
import { RatingSummary } from "./RatingSummary";
import { ReviewForm } from "./ReviewForm";

type CourseReviewsProps = {
    courseId: string;
    firstPage: CourseReviewsPage; // from the server (newest first)
};

/**
 * The reviews section: the summary, "Rate this course" (enrolled students), the list (+ replies),
 * the sort (Newest / Oldest) and "Show more reviews".
 * Only the buyers + the teacher reply (canReply); the others only read.
 */
export function CourseReviews({ courseId, firstPage }: CourseReviewsProps) {
    const [sort, setSort] = useState<CommentSort>("newest");
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCourseReviews(courseId, sort, firstPage);
    const { mutate: createReview, isPending: isCreating } = useCreateReview();
    const { mutate: replyToReview, isPending: isReplyPending } = useReplyToReview();
    const { mutate: updateReview, isPending: isUpdatePending } = useUpdateReview();
    const { mutate: deleteReview, isPending: isDeletePending } = useDeleteReview();

    // a notification link: /courses/<slug>#review-<id> → that comment (or #reviews → the section)
    const focusedId = useScrollToComment("review", "reviews");

    // the summary is the same on every page → the first one (the server one while another sort loads)
    const { summary, canReview, canReply, myReview } = data?.pages[0] ?? firstPage;
    const reviews = data?.pages.flatMap((page) => page.reviews) ?? [];

    // what every review / reply can do (CommentItem calls them)
    const actions: CommentActions = {
        reply: (parentId, body, onDone) =>
            replyToReview({ courseId, parentId, values: { body } }, { onSuccess: onDone }),
        isReplyPending,
        update: (reviewId, body, onDone) =>
            updateReview({ courseId, reviewId, values: { body } }, { onSuccess: onDone }),
        isUpdatePending,
        remove: (reviewId, onDone) => deleteReview({ courseId, reviewId }, { onSuccess: onDone }),
        isDeletePending,
    };

    // the stars under the name (a review only, a reply has none)
    const renderStars = (review: ReviewNode) =>
        review.rating && <RatingStars rating={review.rating} className="mt-1" />;

    // a review edits its stars too (a reply → undefined → CommentItem shows the normal text form)
    const renderEditForm = (review: ReviewNode, depth: number, close: () => void) => {
        if (depth !== 1) return undefined;

        return (
            <ReviewForm
                defaultValues={{ rating: review.rating ?? 0, body: review.body ?? "" }}
                submitLabel="Save"
                isPending={isUpdatePending}
                onCancel={close}
                onSubmit={(values) => updateReview({ courseId, reviewId: review.id, values }, { onSuccess: close })}
            />
        );
    };

    return (
        <section aria-labelledby="reviews" className="space-y-8">
            {/* id="reviews" → the rating at the top of the page links here (#reviews) */}
            <h2 id="reviews" className="scroll-mt-24 text-2xl font-bold tracking-tight text-foreground">
                Reviews
            </h2>

            {summary.count > 0 && <RatingSummary summary={summary} />}

            {/* an enrolled student who didn't review yet */}
            {canReview && !myReview && (
                <Card className="gap-3 rounded-2xl p-5">
                    <div>
                        <h3 className="text-base font-semibold text-foreground">Rate this course</h3>
                        <p className="text-sm text-muted-foreground">Your review helps other students choose.</p>
                    </div>
                    <ReviewForm
                        submitLabel="Post review"
                        isPending={isCreating}
                        onSubmit={(values) => createReview({ courseId, values })}
                    />
                </Card>
            )}

            {myReview && (
                <p className="text-sm text-muted-foreground">
                    You rated this course {myReview.rating} {myReview.rating === 1 ? "star" : "stars"}. You can edit or
                    delete your review from its ⋯ menu below.
                </p>
            )}

            {/* no reviews at all */}
            {data && reviews.length === 0 && (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-4 py-10 text-center">
                    <MessageSquareText className="size-7 text-muted-foreground" />
                    <p className="font-medium text-foreground">No reviews yet</p>
                    <p className="text-sm text-muted-foreground">
                        {canReview
                            ? "Be the first to review this course."
                            : "Students who take this course can rate it."}
                    </p>
                </div>
            )}

            {(reviews.length > 0 || !data) && (
                <div className="space-y-6">
                    <CommentSortSelect value={sort} onChange={setSort} label="Sort reviews" />

                    {/* another sort is loading for the first time */}
                    {!data && <CommentsListSkeleton />}

                    <div className="divide-y divide-border">
                        {reviews.map((review) => (
                            <div key={review.id} className="py-6 first:pt-0">
                                <CommentItem
                                    node={review}
                                    actions={actions}
                                    canReply={canReply}
                                    topName="review"
                                    focusedId={focusedId}
                                    renderUnderName={renderStars}
                                    renderEditForm={renderEditForm}
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
                                {isFetchingNextPage ? "Loading..." : "Show more reviews"}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
