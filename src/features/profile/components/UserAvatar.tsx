import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    size?: "default" | "sm" | "lg";
};

// The user's photo, or the initials ("AH") when there is no photo
export function UserAvatar({ firstName, lastName, avatarUrl, size = "default" }: UserAvatarProps) {
    const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
    const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

    return (
        <Avatar size={size}>
            {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
            <AvatarFallback>{initials || "U"}</AvatarFallback>
        </Avatar>
    );
}
