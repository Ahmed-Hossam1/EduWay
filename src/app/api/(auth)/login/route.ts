import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getAuthRedirectRouteService } from "@/services/auth/getAuthRedirectRoute";
import { getProfileService } from "@/services/auth/getProfile";
import { loginSchema } from "@/features/(auth)/login/schema/loginSchema";


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
                { status: 400 }
            );
        }

        // Step 3: Authenticate with Supabase
        const { email, password } = result.data;

        const supabaseClient = await createSupabaseServerClient();

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            return NextResponse.json(
                { message: "Invalid credentials", error },
                { status: 401 }
            );
        }

        // Step 5: Get the user's profile to determine redirect
        const { role, status } = await getProfileService(data.user.id);

        // get the next route based on the role and status of the user
        const nextRoute = getAuthRedirectRouteService(role, status)

        // Step 8: Return next route to frontend
        return NextResponse.json(
            { success: true, nextRoute },
            { status: 200 }
        );

    } catch (error) {
        console.error("Login API Error:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Failed to login";

        return NextResponse.json(
            { message },
            { status: 400 }
        );
    }
}
