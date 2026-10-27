import { Profile } from "@/features/profile/types";
import { COMMENT_SORTS } from "../constants";

export type CommentSort = (typeof COMMENT_SORTS)[number]; // "newest" | "oldest"

// The person who wrote a comment (only the name + photo come out of the private profile)
export type CommentAuthor = Pick<Profile, "id" | "first_name" | "last_name" | "avatar_url">;

/**
 * One comment + every reply under it (the database builds the tree).
 * The base of a review (ReviewNode = + stars) and of a question (QuestionNode = + best answer).
 */
export interface CommentNode {
    id: string;
    body: string | null;
    created_at: string;
    isDeleted: boolean; // "This comment was deleted" (it stays because it has replies)
    isEdited: boolean;
    isMine: boolean;
    isInstructor: boolean; // the teacher of the course → "Instructor" badge
    author: CommentAuthor | null; // null when deleted
    replies: CommentNode[];
    repliesCount?: number; // top level only: every reply under it (all levels) → "View 3 replies"
}

// What a comment list gives every comment: reply / edit / delete (the hooks of reviews OR questions)
export interface CommentActions {
    reply: (parentId: string, body: string, onDone: () => void) => void;
    isReplyPending: boolean;
    update: (commentId: string, body: string, onDone: () => void) => void;
    isUpdatePending: boolean;
    remove: (commentId: string, onDone: () => void) => void;
    isDeletePending: boolean;
}
