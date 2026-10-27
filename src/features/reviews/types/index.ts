import { CommentNode } from "@/features/comments/types";

// One row of the reviews table: a review (parent_id null, with stars) or a reply (parent_id set, no stars)
export interface Review {
    id: string;
    course_id: string;
    user_id: string;
    parent_id: string | null;
    rating: number | null; // 1 → 5 for a review, null for a reply
    body: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

// One review / reply in the list = a comment + its stars (null on a reply)
export interface ReviewNode extends CommentNode, Pick<Review, "rating"> {
    replies: ReviewNode[];
}

// How many reviews gave N stars (5 → 1)
export interface StarsCount {
    stars: number;
    count: number;
}

// What get_course_reviews() returns: one page of reviews + the summary
export interface CourseReviewsPage {
    summary: {
        average: number;
        count: number;
        stars: StarsCount[];
    };
    canReview: boolean; // enrolled and not the teacher
    canReply: boolean; // enrolled or the teacher (the others only read)
    myReview: Pick<Review, "id" | "rating" | "body"> | null;
    reviews: ReviewNode[];
    hasMore: boolean;
}
