import { signupSchema } from "@/features/(auth)/signup/schema/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthRedirectRouteService } from "@/services/auth/getAuthRedirectRoute";
import { getProfileService } from "@/services/auth/getProfile";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const result = signupSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Invalid signup data",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { firstName, lastName, email, password } = result.data

        const supabaseClient = await createSupabaseServerClient()
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                }
            }

        });


        if (error || !data?.user) {
            return NextResponse.json(
                { message: "Failed to create account" },
                { status: 400 }
            );
        }

        // Supabase quirk: when email is already registered, signUp() succeeds
        // but returns a user with an empty identities array instead of an error.
        if (data.user.identities?.length === 0) {
            return NextResponse.json(
                { message: "An account with this email already exists" },
                { status: 409 }
            );
        }

        // getting profile after creating account to decide where to redirect user to 
        const { role, status } = await getProfileService(data.user.id);

        // get the next route based on the role and status of the user
        const nextRoute = getAuthRedirectRouteService(role, status)

        return NextResponse.json({
            success: true,
            nextRoute,
        }, { status: 201 });
    } catch (error) {
        console.error("Signup API Error:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Failed to create account";

        return NextResponse.json(
            { message },
            { status: 400 }
        );
    }
}