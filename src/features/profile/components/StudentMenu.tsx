"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLinkItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, ClipboardList, GraduationCap, Heart, LogOut, Receipt, ShoppingCart, UserCog } from "lucide-react";
import { getAuthRedirectRoute } from "@/features/auth/shared/utils/getAuthRedirectRoute";
import { useLogout } from "../hooks/useLogout";
import { ProfileStatus, UserRole } from "../types";
import { UserAvatar } from "./UserAvatar";
import { UserMenuHeader } from "./UserMenuHeader";

type StudentMenuProps = {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    role: UserRole;
    status: ProfileStatus | null;
};

// The avatar menu for students (and every user who is not an approved teacher)
export function StudentMenu({ firstName, lastName, avatarUrl, role, status }: StudentMenuProps) {
    const { mutate: logout } = useLogout();

    // A teacher who is not approved yet → a link to his application page
    // (onboarding → /account/onboarding, waiting → /account/waiting, rejected → /account/rejected)
    const isTeacher = role === "teacher";
    const applicationPage = isTeacher ? getAuthRedirectRoute(role, status ?? "") : null;
    const applicationLabel = status === "onboarding" ? "Complete your profile" : "Application status";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label="Open user menu"
                className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <UserAvatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60">
                <UserMenuHeader
                    firstName={firstName}
                    lastName={lastName}
                    avatarUrl={avatarUrl}
                    role={role}
                    status={status}
                />
                <DropdownMenuSeparator />

                {/* What the student does: learn + buy */}
                <DropdownMenuLinkItem href="/my-learning">
                    <BookOpen />
                    My learning
                </DropdownMenuLinkItem>
                <DropdownMenuLinkItem href="/wishlist">
                    <Heart />
                    Wishlist
                </DropdownMenuLinkItem>
                <DropdownMenuLinkItem href="/cart">
                    <ShoppingCart />
                    Cart
                </DropdownMenuLinkItem>
                {/* TODO: the purchases page comes later */}
                <DropdownMenuLinkItem href="/student/purchases">
                    <Receipt />
                    Purchase history
                </DropdownMenuLinkItem>
                <DropdownMenuSeparator />

                {/* The account (TODO: both pages come later) */}
                <DropdownMenuLinkItem href="/account/settings">
                    <UserCog />
                    Profile settings
                </DropdownMenuLinkItem>
                {/* a teacher already applied → his application page, a student → "Become a teacher" */}
                {applicationPage ? (
                    <DropdownMenuLinkItem href={applicationPage}>
                        <ClipboardList />
                        {applicationLabel}
                    </DropdownMenuLinkItem>
                ) : (
                    <DropdownMenuLinkItem href="/account/become-teacher">
                        <GraduationCap />
                        Become a teacher
                    </DropdownMenuLinkItem>
                )}
                <DropdownMenuSeparator />

                {/* Log out is an action, not a page → a normal item */}
                <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
