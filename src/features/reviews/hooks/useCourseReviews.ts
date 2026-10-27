"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { COMMENTS_PAGE_SIZE } from "@/features/comments/constants";
import { CommentSort } from "@/features/comments/types";
import { getCourseReviewsService } from "../services/reviews";
import { CourseReviewsPage } from "../types";

const THREE_MINUTES = 3 * 60 * 1000;

// ["reviews", courseId] = every sort of this course → invalidate it after posting / editing / deleting
export const reviewsQueryKey = (courseId: string) => ["reviews", courseId];

/**
 * The reviews of a course, page by page ("Show more reviews" → fetchNextPage).
 * The first page (newest) comes from the server → it shows right away, no request.
 * Another sort → its own cache, asked from the API.
 *
 *   const { data, fetchNextPage, hasNextPage } = useCourseReviews(courseId, sort, firstPage);
 *   data.pages → [page 1, page 2, ...]
 */
export const useCourseReviews = (courseId: string, sort: CommentSort, firstPage: CourseReviewsPage) => {
    return useInfiniteQuery({
        queryKey: [...reviewsQueryKey(courseId), sort],
        queryFn: ({ pageParam }) => getCourseReviewsService({ courseId, sort, offset: pageParam }),
        initialPageParam: 0,
        // the next page starts after the reviews we already have (10, 20, ...)
        getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length * COMMENTS_PAGE_SIZE : undefined),
        initialData: sort === "newest" ? { pages: [firstPage], pageParams: [0] } : undefined,
        staleTime: THREE_MINUTES,
    });
};
