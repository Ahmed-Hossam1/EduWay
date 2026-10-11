import { WishlistPage } from "@/features/wishlist/WishlistPage";
import { getWishlistCourses } from "@/features/wishlist/server/getWishlistCourses";

export const metadata = {
    title: "My wishlist",
    robots: { index: false }, // a private page → Google shouldn't show it
};

// Protected in proxy.ts → only logged-in users get here
export default function Wishlist() {
    // no await → the title shows right away, the courses are streamed
    const coursesPromise = getWishlistCourses();

    return <WishlistPage coursesPromise={coursesPromise} />;
}
