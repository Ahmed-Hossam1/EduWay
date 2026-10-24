import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const oauthSchema = z.object({
    provider: z.enum(["google", "github"]),
});

// POST /api/auth/oauth  { provider: "google" | "github" } → { url }
// The browser then goes to that url (the Google / GitHub sign-in page).
// After it, Google / GitHub → Supabase → /api/auth/callback (unchanged).
export async function POST(request: NextRequest) {
    const body = await request.json()
    const result = oauthSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json({ message: "A valid provider is required" }, { status: 400 });
    }

    try {
        // the server client saves the one-time code verifier in a cookie,
        // /api/auth/callback reads it back to finish the sign-in
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: result.data.provider,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
            },
        });

        if (error || !data.url) throw error ?? new Error("No OAuth url");

        return NextResponse.json({ url: data.url }, { status: 200 });
    } catch (error) {
        console.error("OAuth start error:", error);
        return NextResponse.json({ message: "Couldn't start the sign-in" }, { status: 500 });
    }
}
