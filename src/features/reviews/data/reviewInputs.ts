import { Input } from "@/types";
import { ReviewValues } from "../schemas/reviewSchemas";

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
