import { z } from "zod";
import { commentTextSchema, commentsQuerySchema } from "@/features/comments/schemas/commentSchemas";

/**
 * POST /api/courses/:courseId/questions
 *   { body }                → a question about the course (the course page)
 *   { body, lessonId }      → a question about a lesson (/learn)
 *   { body, parentId, ... } → an answer / a reply in a question
 */
export const createQuestionSchema = commentTextSchema.extend({
    lessonId: z.uuid().nullable().optional(),
    parentId: z.uuid().optional(),
});

export type CreateQuestionValues = z.infer<typeof createQuestionSchema>;

// GET /api/courses/:courseId/questions?lessonId=...&sort=newest&offset=10
export const questionsQuerySchema = commentsQuerySchema.extend({
    lessonId: z.uuid().nullable().catch(null),
});

// PUT /api/questions/:questionId/best { isBest }
export const bestAnswerSchema = z.object({
    isBest: z.boolean(),
});
