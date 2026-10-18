import { ProfileStatus, UserRole } from "../types";

type RoleBadge = {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
};

/**
 * The badge under the name in the user menu.
 * A teacher is only "Teacher" after the admin approves him, before that we show where he is:
 *
 *   student                    → "Student"
 *   teacher + approved         → "Teacher"
 *   teacher + onboarding       → "Profile incomplete"
 *   teacher + waiting          → "Under review"
 *   teacher + rejected         → "Not approved"
 */
export function getRoleBadge(role: UserRole, status: ProfileStatus | null): RoleBadge {
    if (role === "admin") return { label: "Admin", variant: "default" };

    if (role === "student") return { label: "Student", variant: "secondary" };

    // a teacher
    if (status === "approved") return { label: "Teacher", variant: "default" };
    if (status === "waiting") return { label: "Under review", variant: "outline" };
    if (status === "rejected") return { label: "Not approved", variant: "destructive" };

    return { label: "Profile incomplete", variant: "outline" }; // onboarding
}
