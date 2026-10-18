import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getAuthRedirectRoute } from "@/features/auth/shared/utils/getAuthRedirectRoute";
import { getProfileByIdService } from "@/features/profile/server/getProfileById";
import { loginSchema } from "@/features/auth/login/schemas/loginSchema";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Step 2: Validate request body with Zod schema
        const result = loginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Invalid login data",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        // Step 3: Authenticate with Supabase
        const { email, password } = result.data;

        const supabase = await createSupabaseServerClient();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Login error:", error.code, error.message);

            // right password, but he didn't click the link in the confirmation email yet
            if (error.code === "email_not_confirmed") {
                return NextResponse.json(
                    { message: "Please confirm your email first", code: "email_not_confirmed" },
                    { status: 403 },
                );
            }

            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        // Step 5: Get the user's profile to determine redirect
        const { role, status } = await getProfileByIdService(data.user.id);

        // get the next route based on the role and status of the user
        const nextRoute = getAuthRedirectRoute(role, status);

        // Step 8: Return next route to frontend
        return NextResponse.json({ nextRoute }, { status: 200 });
    } catch (error) {
        console.error("Login API Error:", error);

        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
