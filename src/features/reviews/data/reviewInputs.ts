import { Input } from "@/types";
import { ReplyValues, ReviewValues } from "../schemas/reviewSchemas";
import { ReviewSort } from "../types";

// The text of the review form (the stars have their own picker)
export const reviewInputs: Input<keyof ReviewValues>[] = [
    {
        id: "review-body",
        name: "body",
        type: "textarea",
        label: "Your review (optional)",
        placeholder: "What did you like? What could be better?",
    },
];

// The text of the reply form (ReplyForm doesn't use the id: the form shows under many comments
// at once → each textarea makes its own unique id)
export const replyInputs: Input<keyof ReplyValues>[] = [
    {
        id: "reply-body",
        name: "body",
        type: "textarea",
        placeholder: "Write a reply...",
    },
];

// The sort select of the reviews list
export const reviewSortOptions: { id: ReviewSort; label: string }[] = [
    { id: "newest", label: "Newest" },
    { id: "oldest", label: "Oldest" },
];
