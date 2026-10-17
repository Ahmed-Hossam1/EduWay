import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { forgotPasswordSchema } from "@/features/auth/forgot-password/schemas/forgotPasswordSchema";

// The same answer when the email has an account AND when it doesn't
// → nobody can use this page to find out which emails are registered.
const SENT_MESSAGE = "If an account exists for this email, we sent a link to reset your password.";

// POST /api/auth/forgot-password  { email } → Supabase sends the reset email (our custom SMTP)
// The link in the email → /api/auth/confirm (type=recovery) → /auth/reset-password
export async function POST(request: NextRequest) {
    try {

        const body = await request.json()
        const result = forgotPasswordSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Enter a valid email address" }, { status: 400 });
        }

        const supabase = await createSupabaseServerClient();

        const { email } = result.data
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
            console.error("Forgot password error:", error.code, error.message);

            // Supabase lets one email ask again only after a short wait (and has an hourly limit)
            if (error.status === 429) {
                return NextResponse.json(
                    { message: "Too many requests. Please wait a minute and try again." },
                    { status: 429 },
                );
            }

            return NextResponse.json({ message: "Couldn't send the email. Please try again." }, { status: 500 });
        }

        return NextResponse.json({ message: SENT_MESSAGE }, { status: 200 });
    } catch (error) {
        console.error("Internal Error:", error)
        return NextResponse.json({ message: "something went wrong, please try again later" }, { status: 500 });
    }
}