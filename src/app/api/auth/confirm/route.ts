import { NextRequest, NextResponse } from "next/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// The email types this route accepts (from the Supabase email templates)
const ALLOWED_TYPES: EmailOtpType[] = ["recovery", "email"];

/**
 * confirm token that sent to user email to confirm reset password
 * GET /api/auth/confirm?token_hash=...&type=recovery&next=/auth/reset-password
 *
 * The links in our emails come here (see supabase/email-templates):
 *   - reset password → type=recovery
 *   - confirm signup → type=email (next step)
 *
 * verifyOtp checks the one-time token and logs the user in (session cookies),
 * then we send him to `next`.
 *
 * Why token_hash and not {{ .ConfirmationURL }}: ConfirmationURL only works in the
 * SAME browser that asked for the email. token_hash works on any device
 * (ask on the laptop, open the email on the phone).
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    const next = searchParams.get("next") ?? "/";

    // only our own pages: "/auth/reset-password" yes — "https://evil.com" or "//evil.com" no
    const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";

    // where to go if the link is wrong / expired / already used
    const failUrl = type === "recovery" ? "/auth/forgot-password?error=link_expired" : "/auth/login";

    if (!tokenHash || !type || !ALLOWED_TYPES.includes(type)) {
        return NextResponse.redirect(new URL(failUrl, request.url));
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash,
    });

    if (error) {
        console.error("Email link error:", type, error.code, error.message);
        return NextResponse.redirect(new URL(failUrl, request.url));
    }

    return NextResponse.redirect(new URL(safeNext, request.url));
}
