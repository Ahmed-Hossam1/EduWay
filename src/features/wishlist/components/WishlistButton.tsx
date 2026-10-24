"use client";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRequireLogin } from "@/features/profile/hooks/useRequireLogin";
import { useWishlist } from "../hooks/useWishlist";
import { useToggleWishlist } from "../hooks/useToggleWishlist";

type WishlistButtonProps = {
    courseId: string;
    variant?: "icon" | "full"; // icon → on the course card · full → "Add to wishlist" on the details page
    className?: string;
};

export function WishlistButton({ courseId, variant = "icon", className }: WishlistButtonProps) {
    const requireLogin = useRequireLogin();
    const { data: savedIds = [] } = useWishlist();
    const { mutate: toggleWishlist, isPending } = useToggleWishlist();

    const isSaved = savedIds.includes(courseId);
    const label = isSaved ? "Remove from wishlist" : "Add to wishlist";

    const handleClick = () => {
        // guests have no wishlist → ask them to log in
        if (!requireLogin("Log in to save courses to your wishlist")) return;
        toggleWishlist({ courseId, isSaved });
    };

    const heart = <Heart className={cn(isSaved && "fill-red-500 text-red-500")} />;

    if (variant === "full") {
        return (
            <Button
                type="button"
                variant="ghost"
                size="lg"
                rounded="xl"
                className={cn("h-10 w-full text-muted-foreground", className)}
                onClick={handleClick}
                disabled={isPending} // no double requests while one is running
                aria-pressed={isSaved}
            >
                {heart}
                {isSaved ? "Saved to wishlist" : "Add to wishlist"}
            </Button>
        );
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            rounded="full"
            className={className}
            onClick={handleClick}
            disabled={isPending}
            aria-label={label}
            aria-pressed={isSaved}
            title={label}
        >
            {heart}
        </Button>
    );
}
