import { DropdownMenuGroup, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ProfileStatus, UserRole } from "../types";
import { getRoleBadge } from "../utils/getRoleBadge";
import { UserAvatar } from "./UserAvatar";

type UserMenuHeaderProps = {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    role: UserRole;
    status: ProfileStatus | null;
};

// The top of the user menu (photo + name + role badge): the same in the student and the teacher menu
export function UserMenuHeader({ firstName, lastName, avatarUrl, role, status }: UserMenuHeaderProps) {
    const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
    // "Teacher" only after the approval, "Under review" / "Not approved" / ... before it
    const badge = getRoleBadge(role, status);

    return (
        <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2.5 py-2 text-sm text-foreground">
                <UserAvatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} size="lg" />

                {/* name on top, role (or teacher status) badge under it */}
                <div className="flex min-w-0 flex-col items-start gap-1">
                    <span className="w-full truncate font-semibold">{fullName || "User"}</span>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>
            </DropdownMenuLabel>
        </DropdownMenuGroup>
    );
}
