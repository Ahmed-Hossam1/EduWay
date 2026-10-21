import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TeacherSidebar } from "@/features/teacher-dashboard/components/TeacherSidebar";
import { TeacherNavbar } from "@/features/teacher-dashboard/components/TeacherNavbar";
import { getAuthRedirectRoute } from "@/features/auth/shared/utils/getAuthRedirectRoute";
import { getProfileByIdService } from "@/features/profile/server/getProfileById";
import { getAuthUser } from "@/lib/supabase/getAuthUser";

type TeacherLayoutProps = {
    children: ReactNode; // the page (/teacher/dashboard, /teacher/courses...)
    notifications: ReactNode; // the @notifications slot (the bell)
};

/**
 * The teacher dashboard: sidebar on the left, navbar on top, the page in the middle.
 * No site Navbar / Footer here.
 */
export default async function TeacherLayout({ children, notifications }: TeacherLayoutProps) {
    // 1- A second check after proxy.ts: only an approved teacher stays here
    const user = await getAuthUser(); // not logged in → /auth/login (cached: the page reuses it)

    const profile = await getProfileByIdService(user.id);
    if (profile.role !== "teacher" || profile.status !== "approved") {
        redirect(getAuthRedirectRoute(profile.role, profile.status));
    }

    // 2- The sidebar remembers open / closed in a cookie → the page starts the same way (no jump)
    const cookieStore = await cookies();
    const sidebarOpen = cookieStore.get("sidebar_state")?.value !== "false";

    return (
        <TooltipProvider>
            <SidebarProvider defaultOpen={sidebarOpen}>
                <TeacherSidebar
                    userId={profile.id}
                    firstName={profile.first_name}
                    lastName={profile.last_name}
                    avatarUrl={profile.avatar_url}
                />

                <SidebarInset>
                    <TeacherNavbar firstName={profile.first_name} notifications={notifications} />
                    <div className="flex-1 p-4 sm:p-6">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
