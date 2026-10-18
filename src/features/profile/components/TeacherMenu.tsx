"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLinkItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookCopy, BookOpen, Heart, IdCard, LayoutDashboard, LogOut, Plus, ShoppingCart, UserCog, Wallet } from "lucide-react";
import { useLogout } from "../hooks/useLogout";
import { UserRole } from "../types";
import { UserAvatar } from "./UserAvatar";
import { UserMenuHeader } from "./UserMenuHeader";

type TeacherMenuProps = {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    role: UserRole;
};

// The avatar menu for approved teachers: teaching first, then learning (a teacher can buy courses too)
export function TeacherMenu({ userId, firstName, lastName, avatarUrl, role }: TeacherMenuProps) {
    const { mutate: logout } = useLogout();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label="Open user menu"
                className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <UserAvatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60">
                <UserMenuHeader firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} role={role} />
                <DropdownMenuSeparator />

                {/* What the teacher does: teach */}
                <DropdownMenuLinkItem href="/teacher/dashboard">
                    <LayoutDashboard />
                    Dashboard
                </DropdownMenuLinkItem>
                <DropdownMenuLinkItem href="/teacher/courses">
                    <BookCopy />
                    My courses
                </DropdownMenuLinkItem>
                <DropdownMenuLinkItem href="/teacher/courses/new">
                    <Plus />
                    Create course
                </DropdownMenuLinkItem>
                {/* TODO: the earnings page comes later (with the teacher dashboard) */}
                <DropdownMenuLinkItem href="/teacher/earnings">
                    <Wallet />
                    Earnings
                </DropdownMenuLinkItem>
                <DropdownMenuSeparator />

                {/* What the teacher learns: the same pages as a student */}
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
                <DropdownMenuSeparator />

                {/* The account: how students see the teacher + settings */}
                <DropdownMenuLinkItem href={`/instructors/${userId}`}>
                    <IdCard />
                    My public page
                </DropdownMenuLinkItem>
                {/* TODO: the settings page comes later */}
                <DropdownMenuLinkItem href="/account/settings">
                    <UserCog />
                    Profile settings
                </DropdownMenuLinkItem>
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
