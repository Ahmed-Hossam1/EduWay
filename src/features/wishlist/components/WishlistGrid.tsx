"use client";
import { use } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { CourseCard } from "@/features/courses/components/CourseCard";
import { Course } from "@/features/courses/types";
import { useWishlist } from "../hooks/useWishlist";
import { useRemoveAllWishlist } from "../hooks/useRemoveAllWishlist";

type WishlistGridProps = {
    coursesPromise: Promise<Course[]>;
};

export function WishlistGrid({ coursesPromise }: WishlistGridProps) {
    // the full courses come from the server (streamed)...
    const courses = use(coursesPromise);

    // ...and the ids from the React Query cache → when a heart is clicked here,
    // the cache changes right away (optimistic) and the card disappears without a reload
    const { data: savedIds } = useWishlist();
    const { mutate: removeAll } = useRemoveAllWishlist();
    const visibleCourses = savedIds ? courses.filter((course) => savedIds.includes(course.id)) : courses;

    if (visibleCourses.length === 0) {
        return (
            <Empty className="border border-dashed py-16">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Heart />
                    </EmptyMedia>
                    <EmptyTitle>Your wishlist is empty</EmptyTitle>
                    <EmptyDescription>
                        Save courses you like with the heart icon and find them here later.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button rounded="full" asChild>
                        <Link href="/courses">Browse courses</Link>
                    </Button>
                </EmptyContent>
            </Empty>
        );
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{visibleCourses.length}</span> saved courses
                </p>

                <Button variant="destructive" className="capitalize" onClick={() => removeAll()}>
                    remove all
                </Button>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </>
    );
}
