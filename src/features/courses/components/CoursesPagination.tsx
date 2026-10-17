"use client";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useCoursesSearchParams } from "../hooks/useCoursesSearchParams";
import { CoursesResponse } from "../types";
import { use } from "react";

type props = {
    coursesPromise: Promise<CoursesResponse>;
};

export function CoursesPagination({ coursesPromise }: props) {
    const courses = use(coursesPromise);
    const { page, totalPages } = courses;
    const { updateParams } = useCoursesSearchParams();

    const currentPage = Number(page);
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink isActive>{page}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>{totalPages}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
