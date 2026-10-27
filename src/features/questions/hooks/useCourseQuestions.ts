"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { COMMENTS_PAGE_SIZE } from "@/features/comments/constants";
import { CommentSort } from "@/features/comments/types";
import { getCourseQuestionsService } from "../services/questions";
import { CourseQuestionsPage } from "../types";

const THREE_MINUTES = 3 * 60 * 1000;

// ["questions", courseId] = every place + sort of this course → invalidate it after any change
export const questionsQueryKey = (courseId: string) => ["questions", courseId];

/**
 * The questions of the course page (lessonId null) or of one lesson, page by page ("Show more questions").
 * The first page (newest) comes from the server → it shows right away, no request.
 *
 *   const { data, fetchNextPage, hasNextPage } = useCourseQuestions(courseId, lessonId, sort, firstPage);
 */
export const useCourseQuestions = (
    courseId: string,
    lessonId: string | null,
    sort: CommentSort,
    firstPage: CourseQuestionsPage,
) => {
    return useInfiniteQuery({
        queryKey: [...questionsQueryKey(courseId), lessonId ?? "course", sort],
        queryFn: ({ pageParam }) => getCourseQuestionsService({ courseId, lessonId, sort, offset: pageParam }),
        initialPageParam: 0,
        // the next page starts after the questions we already have (10, 20, ...)
        getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length * COMMENTS_PAGE_SIZE : undefined),
        initialData: sort === "newest" ? { pages: [firstPage], pageParams: [0] } : undefined,
        staleTime: THREE_MINUTES,
    });
};
