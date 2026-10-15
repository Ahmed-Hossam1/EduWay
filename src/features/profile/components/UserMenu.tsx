"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, LayoutDashboard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogout } from "../hooks/useLogout";

type UserMenuProps = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
};

export function UserMenu({ firstName, lastName, avatarUrl }: UserMenuProps) {
  const { mutate: logout } = useLogout()
  const router = useRouter();

  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar>
          {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
          <AvatarFallback>{initials || "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-sm text-foreground">{fullName}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/student/my-courses")}>
          <BookOpen />
          My courses
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/teacher/dashboard")}>
          <LayoutDashboard />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => logout()}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
