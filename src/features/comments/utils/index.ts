import { CommentNode } from "../types";

/**
 * Is this comment somewhere under these replies (any level)? → open the thread that has it.
 *   hasComment(review.replies, "abc") → true when "abc" is a reply, a reply to a reply...
 */
export const hasComment = (replies: CommentNode[], commentId: string | null): boolean => {
    if (!commentId) return false;
    return replies.some((reply) => reply.id === commentId || hasComment(reply.replies, commentId));
};
