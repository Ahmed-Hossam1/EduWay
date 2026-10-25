"use client";
import { use, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { CourseCard } from "@/features/courses/types";
import { pluralize } from "@/lib/format";
import { useCart } from "../hooks/useCart";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { useRemoveAllCart } from "../hooks/useRemoveAllCart";

type CartListProps = {
    coursesPromise: Promise<CourseCard[]>;
};

export function CartList({ coursesPromise }: CartListProps) {
    // full courses from the server (streamed)...
    const courses = use(coursesPromise);

    const { mutate: removeAllCart } = useRemoveAllCart();
    // "Remove all" asks first (it empties the whole cart)
    const [confirmOpen, setConfirmOpen] = useState(false);

    // ...filtered by the ids in the React Query cache => "Remove" hides the row
    // and updates the total right away (optimistic), without a reload
    const { data: cartIds } = useCart();
    const cartCourses = cartIds ? courses.filter((course) => cartIds.includes(course.id)) : courses;

    if (cartCourses.length === 0) {
        return (
            <Empty className="border border-dashed py-16">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <ShoppingCart />
                    </EmptyMedia>
                    <EmptyTitle>Your cart is empty</EmptyTitle>
                    <EmptyDescription>Find a course you like and add it to your cart.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button rounded="full" asChild>
                        <Link href="/courses">Browse courses</Link>
                    </Button>
                </EmptyContent>
            </Empty>
        );
    }

    const total = cartCourses.reduce((sum, course) => sum + course.price, 0);

    return (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
            <Card className="rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                        {cartCourses.length} {pluralize(cartCourses.length, "course")} in cart
                    </p>
                    <Button variant="destructive" className="capitalize" onClick={() => setConfirmOpen(true)}>
                        remove all
                    </Button>
                    <ConfirmDialog
                        open={confirmOpen}
                        onOpenChange={setConfirmOpen}
                        title="Remove all courses from your cart?"
                        description="Your cart will be empty. You can add the courses again later."
                        confirmLabel="Remove all"
                        destructive
                        onConfirm={() => {
                            removeAllCart(); // optimistic: the cart is empty right away
                            setConfirmOpen(false);
                        }}
                    />
                </div>

                <ul className="divide-y divide-border">
                    {cartCourses.map((course) => (
                        <CartItem key={course.id} course={course} />
                    ))}
                </ul>
            </Card>

            <aside>
                <div className="lg:sticky lg:top-24">
                    <CartSummary itemsCount={cartCourses.length} total={total} currency={cartCourses[0].currency} />
                </div>
            </aside>
        </div>
    );
}
