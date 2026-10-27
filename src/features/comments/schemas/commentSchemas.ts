import { z } from "zod";
import { COMMENT_SORTS, MAX_COMMENT_LENGTH } from "../constants";

// The text of any comment (optional by default: a review can have stars only)
export const commentBody = z.string().trim().max(MAX_COMMENT_LENGTH, `Keep it under ${MAX_COMMENT_LENGTH} characters`);

// A reply, an edited reply, a question: text required
export const commentTextSchema = z.object({
    body: commentBody.min(1, "Write something first"),
});

export type CommentTextValues = z.infer<typeof commentTextSchema>;

// GET ...?sort=newest&offset=10 (reviews + questions lists)
export const commentsQuerySchema = z.object({
    sort: z.enum(COMMENT_SORTS).catch("newest"),
    offset: z.coerce.number().int().min(0).catch(0),
});
