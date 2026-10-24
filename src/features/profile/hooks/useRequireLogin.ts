"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProfile } from "./useProfile";

/**
 * For buttons that need an account (wishlist heart, add to cart, enroll):
 * a guest gets a toast and goes to the login page.
 *
 *   const requireLogin = useRequireLogin();
 *   const handleClick = () => {
 *       if (!requireLogin("Log in to add courses to your cart")) return;
 *       addToCart(courseId);
 *   };
 *
 * Returns true when the user is logged in (the button can continue).
 */
export const useRequireLogin = () => {
    const router = useRouter();
    const { data: profile } = useProfile();

    return (message: string): boolean => {
        if (profile) return true;

        toast.info(message);
        router.push("/auth/login");
        return false;
    };
};
