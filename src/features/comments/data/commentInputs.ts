import { Input } from "@/types";
import { CommentTextValues } from "../schemas/commentSchemas";
import { CommentSort } from "../types";

// The text of the small comment form (CommentTextForm doesn't use the id: the form shows under many comments
// at once → each textarea makes its own unique id; the placeholder comes from the form's props)
export const commentTextInputs: Input<keyof CommentTextValues>[] = [
    {
        id: "comment-body",
        name: "body",
        type: "textarea",
        placeholder: "Write a reply...",
    },
];

// The sort select of every comment list
export const commentSortOptions: { id: CommentSort; label: string }[] = [
    { id: "newest", label: "Newest" },
    { id: "oldest", label: "Oldest" },
];
