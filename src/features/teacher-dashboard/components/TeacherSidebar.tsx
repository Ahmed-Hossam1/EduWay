"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronsUpDown, IdCard, LogOut } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLinkItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/features/profile/components/UserAvatar";
import { useLogout } from "@/features/profile/hooks/useLogout";
import { getFullName } from "@/lib/format";
import { teacherNav } from "../data/teacherNav";

type TeacherSidebarProps = {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
};

/**
 * The teacher dashboard sidebar (shadcn Sidebar).
 * Fixed + no data of its own: only links. collapsible="icon" → it can shrink to icons
 * (the icons then show their name in a tooltip). On mobile it becomes a Sheet by itself.
 */
export function TeacherSidebar({ userId, firstName, lastName, avatarUrl }: TeacherSidebarProps) {
    const pathname = usePathname();
    const { mutate: logout } = useLogout();
    const fullName = getFullName(firstName, lastName, "Teacher");

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                {teacherNav.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        isActive={pathname === item.href}
                                        tooltip={item.label}
                                        render={<Link href={item.href} />}
                                    >
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {/* The teacher at the bottom → his menu */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger render={<SidebarMenuButton size="lg" tooltip={fullName} />}>
                                <UserAvatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} size="sm" />
                                <span className="grid flex-1 text-left leading-tight">
                                    <span className="truncate font-semibold">{fullName}</span>
                                    <span className="truncate text-xs text-muted-foreground">Teacher</span>
                                </span>
                                <ChevronsUpDown className="ml-auto" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent side="right" align="end" className="w-56">
                                <DropdownMenuLinkItem href={`/instructors/${userId}`}>
                                    <IdCard />
                                    My public page
                                </DropdownMenuLinkItem>
                                <DropdownMenuLinkItem href="/my-learning">
                                    <BookOpen />
                                    My learning
                                </DropdownMenuLinkItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                                    <LogOut />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            {/* the thin line on the edge: click it to open / close */}
            <SidebarRail />
        </Sidebar>
    );
}
