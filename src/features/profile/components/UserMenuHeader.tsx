import { DropdownMenuGroup, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "../types";
import { UserAvatar } from "./UserAvatar";

type UserMenuHeaderProps = {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    role: UserRole;
};

// The top of the user menu (photo + name + role badge): the same in the student and the teacher menu
export function UserMenuHeader({ firstName, lastName, avatarUrl, role }: UserMenuHeaderProps) {
    const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();

    return (
        <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2.5 py-2 text-sm text-foreground">
                <UserAvatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} size="lg" />

                {/* name on top, role badge under it */}
                <div className="flex min-w-0 flex-col items-start gap-1">
                    <span className="w-full truncate font-semibold">{fullName || "User"}</span>
                    <Badge variant={role === "teacher" ? "default" : "secondary"} className="capitalize">
                        {role}
                    </Badge>
                </div>
            </DropdownMenuLabel>
        </DropdownMenuGroup>
    );
}
