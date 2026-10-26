import { apiClient } from "@/lib/axios/apiClient";
import { ReplyValues, ReviewValues, UpdateReviewValues } from "../schemas/reviewSchemas";
import { CourseReviewsPage, ReviewSort } from "../types";

// GET /api/courses/:courseId/reviews?sort&offset → one page of reviews
export const getCourseReviewsService = async ({
    courseId,
    sort,
    offset,
}: {
    courseId: string;
    sort: ReviewSort;
    offset: number;
}) => {
    return await apiClient.get<CourseReviewsPage>(`/courses/${courseId}/reviews`, { sort, offset });
};

// POST /api/courses/:courseId/reviews { rating, body } → a new review
export const createReviewService = async ({ courseId, values }: { courseId: string; values: ReviewValues }) => {
    return await apiClient.post<{ id: string }>(`/courses/${courseId}/reviews`, values);
};

// POST /api/courses/:courseId/reviews { parentId, body } → a reply to that comment
export const createReplyService = async ({
    courseId,
    parentId,
    values,
}: {
    courseId: string;
    parentId: string;
    values: ReplyValues;
}) => {
    return await apiClient.post<{ id: string }>(`/courses/${courseId}/reviews`, { ...values, parentId });
};

// PATCH /api/reviews/:reviewId { rating?, body } → edit your comment
export const updateReviewService = async ({ reviewId, values }: { reviewId: string; values: UpdateReviewValues }) => {
    return await apiClient.patch<{ message: string }>(`/reviews/${reviewId}`, values);
};

// DELETE /api/reviews/:reviewId → delete your comment
export const deleteReviewService = async (reviewId: string) => {
    return await apiClient.delete<{ message: string }>(`/reviews/${reviewId}`);
};
