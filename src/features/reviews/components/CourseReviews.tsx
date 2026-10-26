"use client";

import { useState } from "react";
import { MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reviewSortOptions } from "../data/reviewInputs";
import { useCourseReviews } from "../hooks/useCourseReviews";
import { useCreateReview } from "../hooks/useCreateReview";
import { CourseReviewsPage, ReviewSort } from "../types";
import { RatingSummary } from "./RatingSummary";
import { ReviewForm } from "./ReviewForm";
import { ReviewItem } from "./ReviewItem";
import { ReviewsListSkeleton } from "./skeleton";

type CourseReviewsProps = {
    courseId: string;
    firstPage: CourseReviewsPage; // from the server (newest first)
    isLoggedIn: boolean;
};

/**
 * The reviews section: the summary, "Rate this course" (enrolled students), the list (+ replies),
 * the sort (Newest / Oldest) and "Show more reviews".
 */
export function CourseReviews({ courseId, firstPage, isLoggedIn }: CourseReviewsProps) {
    const [sort, setSort] = useState<ReviewSort>("newest");
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCourseReviews(courseId, sort, firstPage);
    const { mutate: createReview, isPending: isCreating } = useCreateReview();

    // the summary is the same on every page → the first one (the server one while another sort loads)
    const { summary, canReview, myReview } = data?.pages[0] ?? firstPage;
    const reviews = data?.pages.flatMap((page) => page.reviews) ?? [];

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
                    <div className="flex items-center justify-end gap-2">
                        <span className="text-sm text-muted-foreground">Sort by</span>
                        <Select
                            value={sort}
                            onValueChange={(value) => setSort(value as ReviewSort)}
                            itemToStringLabel={(id) =>
                                reviewSortOptions.find((option) => option.id === id)?.label ?? ""
                            }
                        >
                            <SelectTrigger className="w-32" aria-label="Sort reviews">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {reviewSortOptions.map((option) => (
                                    <SelectItem key={option.id} value={option.id}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* another sort is loading for the first time */}
                    {!data && <ReviewsListSkeleton />}

                    <div className="divide-y divide-border">
                        {reviews.map((review) => (
                            <div key={review.id} className="py-6 first:pt-0">
                                <ReviewItem node={review} courseId={courseId} isLoggedIn={isLoggedIn} />
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
