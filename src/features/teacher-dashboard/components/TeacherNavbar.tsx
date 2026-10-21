import { Logo } from "@/components/layout/Logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

type TeacherNavbarProps = {
    firstName: string | null;
    notifications: ReactNode; // the @notifications slot (the bell)
};

// The top bar of the dashboard: open/close the sidebar, the logo, "Hi, Ahmed", theme + bell
export function TeacherNavbar({ firstName, notifications }: TeacherNavbarProps) {
    return (
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-md">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-full" />

            <Logo />

            <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-semibold text-foreground">Hi, {firstName || "there"}</p>
                <p className="truncate text-xs text-muted-foreground">Here&apos;s what&apos;s happening with your courses</p>
            </div>

            <div className="ml-auto flex items-center gap-1">
                <AnimatedThemeToggler className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" />
                {notifications}
            </div>
        </header>
    );
}
