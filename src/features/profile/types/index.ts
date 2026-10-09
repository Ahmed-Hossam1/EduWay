export type UserRole = "student" | "teacher" | "admin";

export type ProfileStatus =
    | "approved"
    | "onboarding"
    | "waiting"
    | "rejected";

export interface Profile {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    status: ProfileStatus;
    created_at: string;
    updated_at: string;
}

// The small part of the profile that /api/auth/me returns (navbar, avatar, ...)
export type ProfileSummary = Pick<Profile, "id" | "first_name" | "last_name" | "avatar_url" | "role">;
