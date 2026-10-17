"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, Heart, LogOut, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogout } from "../hooks/useLogout";
import { UserAvatar } from "./UserAvatar";
import { UserMenuHeader } from "./UserMenuHeader";

type StudentMenuProps = {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
};

// The avatar menu for students (and every user who is not an approved teacher)
export function StudentMenu({ firstName, lastName, avatarUrl }: StudentMenuProps) {
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

                {/* What the student does: learn + buy */}
                <DropdownMenuItem onClick={() => router.push("/student/my-courses")}>
                    <BookOpen />
                    My learning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/student/wishlist")}>
                    <Heart />
                    Wishlist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/cart")}>
                    <ShoppingCart />
                    Cart
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
