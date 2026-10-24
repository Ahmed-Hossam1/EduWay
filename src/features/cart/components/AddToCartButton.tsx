"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRequireLogin } from "@/features/profile/hooks/useRequireLogin";
import { useCart } from "../hooks/useCart";
import { useAddToCart } from "../hooks/useAddToCart";

type AddToCartButtonProps = {
    courseId: string;
};

// "Add to cart" → after adding it becomes "Go to cart" (a link to /cart)
export function AddToCartButton({ courseId }: AddToCartButtonProps) {
    const requireLogin = useRequireLogin();
    const { data: cartIds = [] } = useCart();
    const { mutate: addToCart, isPending } = useAddToCart();

    const isInCart = cartIds.includes(courseId);

    if (isInCart) {
        return (
            <Button variant="outline" size="lg" rounded="xl" className="h-11 w-full font-semibold" asChild>
                <Link href="/cart">
                    <ShoppingCart />
                    Go to cart
                </Link>
            </Button>
        );
    }

    const handleClick = () => {
        // choice: the cart needs an account (same as the wishlist)
        if (!requireLogin("Log in to add courses to your cart")) return;
        addToCart(courseId);
    };

    return (
        <Button
            type="button"
            variant="outline"
            size="lg"
            rounded="xl"
            className="h-11 w-full font-semibold"
            onClick={handleClick}
            disabled={isPending}
        >
            <ShoppingCart />
            Add to cart
        </Button>
    );
}
