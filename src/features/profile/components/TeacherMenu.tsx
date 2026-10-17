"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookCopy, IdCard, LayoutDashboard, LogOut, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogout } from "../hooks/useLogout";
import { UserAvatar } from "./UserAvatar";
import { UserMenuHeader } from "./UserMenuHeader";

type TeacherMenuProps = {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
};

// The avatar menu for approved teachers (no wishlist / cart: a teacher sells courses, he doesn't buy them)
export function TeacherMenu({ userId, firstName, lastName, avatarUrl }: TeacherMenuProps) {
    const { mutate: logout } = useLogout();
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label="Open user menu"
                className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <UserAvatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <UserMenuHeader firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} />
                <DropdownMenuSeparator />

                {/* What the teacher does: teach */}
                <DropdownMenuItem onClick={() => router.push("/teacher/dashboard")}>
                    <LayoutDashboard />
                    Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/teacher/courses")}>
                    <BookCopy />
                    My courses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/teacher/courses/new")}>
                    <Plus />
                    Create course
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {/* How students see the teacher */}
                <DropdownMenuItem onClick={() => router.push(`/instructors/${userId}`)}>
                    <IdCard />
                    My public page
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
