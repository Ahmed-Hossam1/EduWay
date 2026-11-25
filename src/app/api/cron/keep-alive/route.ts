import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * GET /api/cron/keep-alive  ← Vercel calls it once a day (vercel.json → "crons"), NOT the browser
 *
 * Why: on the free plan, Supabase PAUSES a project after 7 days without requests.
 * A small read every day = the project is never "inactive" → it never pauses.
 *
 * Only Vercel can call it: Vercel sends "Authorization: Bearer <CRON_SECRET>" by itself
 * (CRON_SECRET = an env variable on Vercel). Anybody else → 401.
 */
export async function GET(request: NextRequest) {
    const secret = process.env.CRON_SECRET;
    if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // the smallest real read: one category id (public data, the normal client + RLS is enough)
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.from("categories").select("id").limit(1);
        if (error) throw error;

        return NextResponse.json({ message: "Supabase is awake", at: new Date().toISOString() }, { status: 200 });
    } catch (error) {
        console.error("Keep-alive error:", error);
        return NextResponse.json({ message: "Couldn't reach Supabase" }, { status: 500 });
    }
}
