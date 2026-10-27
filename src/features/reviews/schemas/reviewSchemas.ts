import { z } from "zod";
import { commentBody, commentTextSchema } from "@/features/comments/schemas/commentSchemas";

// A review: 1 → 5 stars + optional text → the review form AND the API routes use it
export const reviewSchema = z.object({
    rating: z.number().int().min(1, "Choose a rating").max(5, "Choose a rating"),
    body: commentBody,
});

export type ReviewValues = z.infer<typeof reviewSchema>;

// POST /api/courses/:courseId/reviews with a parentId = a reply to that comment (text required)
export const createReplySchema = commentTextSchema.extend({
    parentId: z.uuid(),
});

// PATCH /api/reviews/:reviewId → the new text (+ the new stars when it's a review)
export const updateReviewSchema = z.object({
    rating: reviewSchema.shape.rating.optional(),
    body: commentBody,
});

export type UpdateReviewValues = z.infer<typeof updateReviewSchema>;
