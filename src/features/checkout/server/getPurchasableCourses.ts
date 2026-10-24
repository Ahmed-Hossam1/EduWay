import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isCourseOwner } from "@/lib/authorization/ownership";

// A course in the cart that can go to Stripe (only what the checkout needs)
export type PurchasableCourse = {
    id: string;
    title: string;
    price: number;
    currency: string;
    status: string;
    instructor_id: string;
    thumbnail_url: string | null;
};

type CartRow = {
    course: PurchasableCourse | null; // null = the course was unpublished (hidden by RLS)
};

type PurchasableCourses = {
    courses: PurchasableCourse[]; // what he can really buy now
    hasOwnCourse: boolean; // his OWN course is in the cart (to show a clear message)
};

/**
 * Server only: the business rules of "what can this user buy from his cart?", in one place.
 * A course can be bought when it is:
 *   published + paid + not his own course + not owned already (a refunded course can be bought again)
 * The server reads the cart itself → the browser can't send fake courses or fake prices.
 */
export async function getPurchasableCourses(userId: string): Promise<PurchasableCourses> {
    const supabase = await createSupabaseServerClient();

    // 1- his cart with the course of each row
    const { data: cartRows, error: cartError } = await supabase
        .from("cart_items")
        .select("course:courses ( id, title, price, currency, status, instructor_id, thumbnail_url )")
        .eq("user_id", userId);

    if (cartError) throw cartError;

    // 2- the courses he already owns
    const { data: enrollments, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", userId)
        .neq("status", "refunded");

    if (enrollmentsError) throw enrollmentsError;

    const ownedIds = enrollments.map((item) => item.course_id);

    // Supabase can't know the shape of the join → we tell it here
    const cartCourses = (cartRows as unknown as CartRow[])
        .map((row) => row.course)
        .filter((course) => course !== null);

    // 3- keep only the courses he can really buy
    const courses = cartCourses
        .filter((course) => course.status === "published")
        .filter((course) => course.price > 0)
        .filter((course) => !isCourseOwner(userId, course)) // a teacher can't buy his own course
        .filter((course) => !ownedIds.includes(course.id));

    const hasOwnCourse = cartCourses.some((course) => isCourseOwner(userId, course));

    return { courses, hasOwnCourse };
}
