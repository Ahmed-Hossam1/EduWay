import { z } from "zod";
import { MAX_REVIEW_LENGTH, REVIEW_SORTS } from "../constants";

const reviewBody = z.string().trim().max(MAX_REVIEW_LENGTH, `Keep it under ${MAX_REVIEW_LENGTH} characters`);

// A review: 1 → 5 stars + optional text → the review form AND the API routes use it
export const reviewSchema = z.object({
    rating: z.number().int().min(1, "Choose a rating").max(5, "Choose a rating"),
    body: reviewBody,
});

export type ReviewValues = z.infer<typeof reviewSchema>;

// A reply: text only (required)
export const replySchema = z.object({
    body: reviewBody.min(1, "Write a reply"),
});

export type ReplyValues = z.infer<typeof replySchema>;

// POST /api/courses/:courseId/reviews with a parentId = a reply to that comment
export const createReplySchema = replySchema.extend({
    parentId: z.uuid(),
});

// PATCH /api/reviews/:reviewId → the new text (+ the new stars when it's a review)
export const updateReviewSchema = z.object({
    rating: reviewSchema.shape.rating.optional(),
    body: reviewBody,
});

export type UpdateReviewValues = z.infer<typeof updateReviewSchema>;

// GET /api/courses/:courseId/reviews?sort=newest&offset=10
export const reviewsQuerySchema = z.object({
    sort: z.enum(REVIEW_SORTS).catch("newest"),
    offset: z.coerce.number().int().min(0).catch(0),
});
