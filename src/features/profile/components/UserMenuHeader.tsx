import { DropdownMenuGroup, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./UserAvatar";

type UserMenuHeaderProps = {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
};

// The top of the user menu (photo + name): the same in the student and the teacher menu
export function UserMenuHeader({ firstName, lastName, avatarUrl }: UserMenuHeaderProps) {
    const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();

    return (
        <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2.5 py-2 text-sm text-foreground">
                <UserAvatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} size="sm" />
                <span className="truncate font-semibold">{fullName || "User"}</span>
            </DropdownMenuLabel>
        </DropdownMenuGroup>
    );
}
