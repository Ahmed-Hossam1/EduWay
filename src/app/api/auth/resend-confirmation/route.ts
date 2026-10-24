import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resendConfirmationSchema } from "@/features/auth/confirm-email/schemas/resendConfirmationSchema";

// The same answer for every email (waiting for confirmation, already confirmed, or no account)
// → nobody can use this to find out which emails are registered.
const SENT_MESSAGE = "If this email is waiting for confirmation, we sent a new link.";

// POST /api/auth/resend-confirmation  { email } → Supabase sends the "Confirm signup" email again
// The link in the email → /api/auth/confirm (type=email) → /account/choose-role
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const result = resendConfirmationSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Enter a valid email address" }, { status: 400 });
        }

        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.auth.resend({
            type: "signup",
            email: result.data.email,
        });

        if (error) {
            console.error("Resend confirmation error:", error.code, error.message);

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
        console.error("Resend confirmation API Error:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
