import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AuthRole } from "@/features/(auth)/signup/types";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const role = body.role as AuthRole

    // Validate role
    if (!role || !["student", "teacher"].includes(role)) {
        return NextResponse.json(
            { message: "A valid role is required" },
            { status: 400 }
        );
    }

    const supabase = await createSupabaseServerClient();

    // Get authenticated user
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    // Determine initial status
    const status = role === "teacher" ? "onboarding" : "approved";

    // Assign role only if it hasn't been assigned yet
    const { data, error } = await supabase
        .from("profiles")
        .update({
            role,
            status,
        })
        .eq("id", user.id)
        .is("role", null)
        .select("id")
        .maybeSingle();

    if (error) {
        console.error("Assign role error:", error);

        return NextResponse.json(
            { message: "Failed to assign role" },
            { status: 500 }
        );
    }

    // Profile already has a role
    if (!data) {
        return NextResponse.json(
            { message: "Role already assigned" },
            { status: 409 }
        );
    }

    const nextRoute =
        role === "teacher"
            ? "/onboarding"
            : "/";

    return NextResponse.json(
        {
            message: "Role assigned successfully",
            nextRoute,
        },
        { status: 200 }
    );
}