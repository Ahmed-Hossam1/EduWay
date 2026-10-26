import { Profile } from "@/features/profile/types";
import { REVIEW_SORTS } from "../constants";

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

export type ReviewSort = (typeof REVIEW_SORTS)[number]; // "newest" | "oldest"

// The person who wrote a comment (only the name + photo come out of the private profile)
export type ReviewAuthor = Pick<Profile, "id" | "first_name" | "last_name" | "avatar_url">;

// One comment in the list + every reply under it (the database builds the tree)
export type ReviewNode = Pick<Review, "id" | "rating" | "body" | "created_at"> & {
    isDeleted: boolean; // "This comment was deleted" (it stays because it has replies)
    isEdited: boolean;
    isMine: boolean;
    isInstructor: boolean; // the teacher of the course → "Instructor" badge
    author: ReviewAuthor | null; // null when deleted
    replies: ReviewNode[];
    repliesCount?: number; // top level only: every reply under it (all levels) → "View 3 replies"
};

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
    myReview: Pick<Review, "id" | "rating" | "body"> | null;
    reviews: ReviewNode[];
    hasMore: boolean;
}
