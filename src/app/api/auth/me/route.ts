import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createSupabaseServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { data: profile } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, avatar_url, role, status")
            .eq("id", user.id)
            .single();

        if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 });
        return NextResponse.json(profile, { status: 200 });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
