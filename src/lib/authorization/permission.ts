import { ProfileStatus, UserRole } from "@/features/profile/types";

// Every action that needs a permission: "<thing>:<action>"
export type Permission = "course:create" | "course:update" | "course:delete";

// What each role can do.
// Reading courses is not here: everyone (even a guest) can read the published courses.
const rolePermissions: Record<UserRole, Permission[]> = {
    student: [],
    teacher: ["course:create", "course:update", "course:delete"],
    admin: [], // the admin can do everything (see hasPermission)
};

/**
 * Can a user with this role + status do this action? (used in the API routes)
 *
 *   hasPermission("teacher", "approved", "course:create") → true
 *   hasPermission("teacher", "waiting",  "course:create") → false (not approved yet)
 *   hasPermission("student", "approved", "course:create") → false
 *
 * "course:update" means "can update courses at all".
 * To allow only HIS OWN courses, also check the owner (ownership.ts).
 */
export function hasPermission(role: UserRole | null, status: ProfileStatus | null, permission: Permission): boolean {
    // no role yet (before choose-role) → nothing
    if (!role) return false;

    // the admin can do everything
    if (role === "admin") return true;

    // a teacher must be approved before he can teach
    if (role === "teacher" && status !== "approved") return false;

    return rolePermissions[role].includes(permission);
}
