import { ProfileStatus, UserRole } from "@/features/profile/types";

// Pages that only some roles can open (a path covers its sub-pages: "/student" → "/student/wishlist").
// A page that is NOT here is public (/, /courses, /categories, ...).
const roleRoutes: Record<UserRole, string[]> = {
    student: ["/student", "/cart"],
    teacher: ["/teacher"],
    admin: ["/admin"],
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
 *   canAccessRoute("student", "approved", "/student/wishlist")  → true
 *   canAccessRoute("student", "approved", "/teacher/dashboard") → false
 *   canAccessRoute("teacher", "waiting",  "/teacher/dashboard") → false (not approved yet)
 */
export function canAccessRoute(role: UserRole | null, status: ProfileStatus | null, pathname: string): boolean {
    // public page → everyone
    if (!isProtectedRoute(pathname)) return true;

    // no role yet (before choose-role) → no role page
    if (!role) return false;

    // the admin can open everything
    if (role === "admin") return true;

    // a teacher must be approved first
    if (role === "teacher" && status !== "approved") return false;

    return roleRoutes[role].some((route) => matchesRoute(pathname, route));
}
