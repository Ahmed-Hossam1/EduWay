"use client"
import Image from "next/image"
import Link from "next/link"
import { Clock, Heart, ImageOff, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Course } from "@/features/courses/types"
import { formatDuration, formatPrice, getInstructorName } from "@/features/courses/utils/format"
import { useToggleWishlist } from "@/features/wishlist/hooks/useToggleWishlist"
import { useRemoveFromCart } from "../hooks/useRemoveFromCart"

type CartItemProps = {
    course: Course
}

// One course row in the cart: thumbnail · title · instructor · price · Remove / Move to wishlist
export function CartItem({ course }: CartItemProps) {
    const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart()
    const { mutate: removeSilently } = useRemoveFromCart({ silent: true })
    const { mutate: toggleWishlist, isPending: isMoving } = useToggleWishlist()

    // out of the cart + into the wishlist (its own toast says "Added to wishlist")
    const handleMoveToWishlist = () => {
        removeSilently(course.id)
        toggleWishlist({ courseId: course.id, isSaved: false })
    }

    const isBusy = isRemoving || isMoving

    return (
        <li className="flex gap-4 py-5 first:pt-0 last:pb-0">
            {/* Thumbnail */}
            <Link
                href={`/courses/${course.slug}`}
                className="relative aspect-16/10 w-28 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-40"
            >
                {course.thumbnail_url ? (
                    <Image src={course.thumbnail_url} alt={course.title} fill sizes="160px" className="object-cover" />
                ) : (
                    <span className="flex size-full items-center justify-center text-muted-foreground">
                        <ImageOff className="size-6" />
                    </span>
                )}
            </Link>

            {/* Info + actions */}
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:justify-between sm:gap-4">
                <div className="min-w-0">
                    <Link
                        href={`/courses/${course.slug}`}
                        className="line-clamp-2 text-sm font-semibold text-foreground transition-colors hover:text-primary sm:text-base"
                    >
                        {course.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">By {getInstructorName(course.instructor)}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        {formatDuration(course.duration_seconds)} · {course.lessons_count} lessons
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1">
                        <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-destructive"
                            onClick={() => removeFromCart(course.id)}
                            disabled={isBusy}
                        >
                            <Trash2 />
                            Remove
                        </Button>
                        <span className="text-muted-foreground/50">·</span>
                        <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0"
                            onClick={handleMoveToWishlist}
                            disabled={isBusy}
                        >
                            <Heart />
                            Move to wishlist
                        </Button>
                    </div>
                </div>

                <p className="shrink-0 text-base font-black text-foreground sm:text-lg">
                    {formatPrice(course.price, course.currency)}
                </p>
            </div>
        </li>
    )
}
