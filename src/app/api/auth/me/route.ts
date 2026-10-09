import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabaseServer = await createSupabaseServerClient()
        const { data: { user } } = await supabaseServer.auth.getUser()
        if (!user) return NextResponse.json({ error: "User not authenticated" }, { status: 401 })

        const { data: profile } = await supabaseServer.from("profiles").select("id, first_name, last_name, avatar_url, role").eq("id", user.id).single()

        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        return NextResponse.json(profile, { status: 200 })
    }
    catch (error) {
        console.error("Error fetching profile:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}