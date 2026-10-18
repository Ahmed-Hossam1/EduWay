import { ProfileStatus, UserRole } from "@/features/profile/types";

// The student pages (the checkout).
// /cart is public; /wishlist and /my-learning are for any logged-in user (see protectedRoutes in proxy.ts)
const studentRoutes = ["/student"];

// Pages that only some roles can open (a path covers its sub-pages: "/student" → "/student/checkout/success").
// A page that is NOT here is public (/, /courses, /categories, ...).
const roleRoutes: Record<UserRole, string[]> = {
    student: studentRoutes,
    teacher: ["/teacher", ...studentRoutes], // a teacher can learn too (buy and follow other courses)
    admin: ["/admin"], // the admin can open everything (see canAccessRoute)
};

// "/teacher" matches "/teacher" and "/teacher/dashboard", but not "/teachers"
function matchesRoute(pathname: string, route: string): boolean {
    return pathname === route || pathname.startsWith(route + "/");
}

// Is this page for some roles only?
export function isProtectedRoute(pathname: string): boolean {
    const allRoutes = Object.values(roleRoutes).flat();
    return allRoutes.some((route) => matchesRoute(pathname, route));
}

/**
 * Can a user with this role + status open this page?
 *
 *   canAccessRoute("student", "approved", "/courses")           → true  (public page)
 *   canAccessRoute("student", "approved", "/student/checkout/success") → true
 *   canAccessRoute("student", "approved", "/teacher/dashboard") → false
 *   canAccessRoute("teacher", "waiting",  "/teacher/dashboard") → false (not approved yet)
 *   canAccessRoute("teacher", "waiting",  "/student/checkout/success") → true (he can still buy)
 */
export function canAccessRoute(role: UserRole | null, status: ProfileStatus | null, pathname: string): boolean {
    // public page → everyone
    if (!isProtectedRoute(pathname)) return true;

    // no role yet (before choose-role) → no role page
    if (!role) return false;

    // the admin can open everything
    if (role === "admin") return true;

    // a teacher who is not approved yet can only learn (no teacher pages)
    if (role === "teacher" && status !== "approved") {
        return studentRoutes.some((route) => matchesRoute(pathname, route));
    }

    return roleRoutes[role].some((route) => matchesRoute(pathname, route));
}
