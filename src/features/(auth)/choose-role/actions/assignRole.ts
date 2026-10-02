"use server";

import { AuthRole } from "@/features/(auth)/signup/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function assignRoleAction(role: AuthRole) {
    const supabase = await createSupabaseServerClient();

    // Get the currently authenticated user from the Supabase session.
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login?error=unauthorized");
    }

    // Determine the initial status based on the selected role.
    const status = role === "teacher" ? "onboarding" : "approved";

    // Only allow assigning a role if the profile doesn't have one yet.
    const { data, error } = await supabase
        .from("profiles")
        .update({ role, status })
        .eq("id", user.id)
        .is("role", null)
        .select("id")
        .maybeSingle();

    if (error) {
        console.error("Assign role error:", error);
        throw new Error("Failed to assign role");
    }

    // No profile was updated.
    // This can happen if the user already has a role.
    if (!data) {
        redirect("/login?error=role_already_assigned");
    }

    // Redirect based on the selected role.
    if (role === "teacher") {
        redirect("/onboarding");
    }

    redirect("/");
}