"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, LogOut } from "lucide-react";
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
import { supabaseClient } from "@/lib/supabase/client";

type UserMenuProps = {
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
};

export function UserMenu({ firstName, lastName, avatarUrl }: UserMenuProps) {
  const router = useRouter();
  const queryClient = useQueryClient()

  const fullName = `${firstName} ${lastName ?? ""}`.trim();
  const initials = `${firstName[0]} ${lastName?.[0] ?? ""}`.toUpperCase();

  const handleLogout = async () => {
    // 1- Remove the session cookies from Supabase
    await supabaseClient.auth.signOut();
    // 2- Clear the cached profile so the navbar shows Log in / Sign up again
    queryClient.setQueryData(["profile"], null);
    // 3- Go home and re-run the proxy / server components without the session
    router.push("/");
    router.refresh();
  };

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
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <LayoutDashboard />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
