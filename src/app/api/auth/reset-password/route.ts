import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/requireUser";
import { resetPasswordSchema } from "@/features/auth/reset-password/schemas/resetPasswordSchema";

// POST /api/auth/reset-password  { password, confirmPassword } → { nextRoute: "/auth/login" }
// The user has a session here because the email link (/api/auth/confirm) logged him in.
export async function POST(request: NextRequest) {
    try {
        // 1- Same rules as the form
        const body = await request.json()
        const result = resetPasswordSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Invalid password",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        // 2- No session = the link was never opened, or it expired (own message instead of "Unauthorized")
        const auth = await requireUser();
        if (!auth.ok) {
            return NextResponse.json({ message: "Your reset link expired. Please request a new one." }, { status: 401 });
        }
        const { supabase } = auth;

        // 3- Change the password
        const { error } = await supabase.auth.updateUser({
            password: result.data.password,
        });

        if (error) {
            console.error("Reset password error:", error.code, error.message);

            if (error.code === "same_password") {
                return NextResponse.json(
                    { message: "Your new password must be different from the old one." },
                    { status: 400 },
                );
            }

            return NextResponse.json({ message: "Couldn't update your password. Please try again." }, { status: 500 });
        }

        // 4- Log out → he signs in again with the new password
        //    (also ends the session that the email link created)
        await supabase.auth.signOut();

        return NextResponse.json({ nextRoute: "/auth/login" }, { status: 200 });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}