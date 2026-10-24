import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";

// A user can pick student or teacher by himself (admin is given manually)
const chooseRoleSchema = z.object({
    role: z.enum(["student", "teacher"]),
});

// POST /api/auth/choose-role  { role } → { message, nextRoute }
// Once, after signing up (email or Google / GitHub): the profile gets its role + first status.
export async function POST(request: NextRequest) {
    try {
        // 1- Validate the role (a broken body → 400, not a crash)
        const body = await request.json().catch(() => null);
        const result = chooseRoleSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "A valid role is required" }, { status: 400 });
        }
        const { role } = result.data;

        // 2- Logged in?
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // 3- The database gives the role + the first status (teacher → onboarding, student → approved),
        //    only if he has no role yet → false = he already has one
        const { data: assigned, error } = await supabase.rpc("choose_my_role", { p_role: role });

        if (error) throw error;

        if (!assigned) {
            return NextResponse.json({ message: "Role already assigned" }, { status: 409 });
        }

        const nextRoute = role === "teacher" ? "/account/onboarding" : "/";

        return NextResponse.json({ message: "Role assigned successfully", nextRoute }, { status: 200 });
    } catch (error) {
        console.error("Assign role error:", error);
        return NextResponse.json({ message: "Failed to assign role" }, { status: 500 });
    }
}
