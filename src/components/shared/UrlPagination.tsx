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
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { cn } from "@/lib/utils";

type UrlPaginationProps = {
    totalCount: number; // how many items in ALL the pages (e.g. 43 courses)
    pageSize: number; // how many items in ONE page (e.g. 10)
    siblingCount?: number; // how many pages to show on each side of the current one (default 1)
    className?: string;
};

/**
 * The page numbers to show: the first, the last, and the pages around the current one.
 *   page 1 of 3  → [1, 2, 3]
 *   page 5 of 10 → [1, "...", 4, 5, 6, "...", 10]   (siblingCount = 1)
 */
function getPageNumbers(page: number, totalPages: number, siblingCount: number): (number | "...")[] {
    const pages: (number | "...")[] = [];

    for (let number = 1; number <= totalPages; number++) {
        const isEdge = number === 1 || number === totalPages;
        const isNearCurrent = Math.abs(number - page) <= siblingCount;

        if (isEdge || isNearCurrent) pages.push(number);
        else if (pages[pages.length - 1] !== "...") pages.push("..."); // only one "..." in a row
    }

    return pages;
}

/**
 * Ready-to-use pagination for any list whose page is in the URL (?page=2).
 * Give it the data only → it finds the rest by itself:
 *   totalPages  = totalCount / pageSize (rounded up)
 *   current page = ?page in the URL (missing or broken → 1)
 *   the "..."    = when there are pages hidden in the middle
 * Each number is a <Link>, and the other params (filters, search, sort) stay as they are.
 *
 *   <UrlPagination totalCount={43} pageSize={10} />
 */
export function UrlPagination({ totalCount, pageSize, siblingCount = 1, className }: UrlPaginationProps) {
    const { getValue, getHref } = useUrlSearchParams();

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    // one page only → nothing to show
    if (totalPages <= 1) return null;

    // ?page=abc or ?page=99 → stay inside 1..totalPages
    const pageFromUrl = Number(getValue("page")) || 1;
    const page = Math.min(Math.max(1, pageFromUrl), totalPages);

    // page 1 → no ?page in the URL (cleaner link)
    const getPageHref = (pageNumber: number) => getHref({ page: pageNumber === 1 ? null : String(pageNumber) });

    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;

    return (
        <Pagination className={className}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={getPageHref(Math.max(1, page - 1))}
                        aria-disabled={isFirstPage}
                        className={cn(isFirstPage && "pointer-events-none opacity-50")}
                    />
                </PaginationItem>

                {getPageNumbers(page, totalPages, siblingCount).map((pageNumber, index) => (
                    <PaginationItem key={`${pageNumber}-${index}`}>
                        {pageNumber === "..." ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink href={getPageHref(pageNumber)} isActive={pageNumber === page}>
                                {pageNumber}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href={getPageHref(Math.min(totalPages, page + 1))}
                        aria-disabled={isLastPage}
                        className={cn(isLastPage && "pointer-events-none opacity-50")}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
