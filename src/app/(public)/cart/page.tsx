import { CartPage } from "@/features/cart/CartPage";
import { getCartCourses } from "@/features/cart/server/getCartCourses";

export const metadata = {
    title: "Shopping cart",
    robots: { index: false }, // a private page => Google shouldn't show it
};

// Public page: a guest just sees an empty cart (RLS returns no rows)
export default function Cart() {
    // no await => the title shows right away, the courses are streamed
    const coursesPromise = getCartCourses();

    return <CartPage coursesPromise={coursesPromise} />;
}
