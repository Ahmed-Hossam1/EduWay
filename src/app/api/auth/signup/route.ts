import { signupSchema } from "@/features/auth/signup/schemas/signupSchema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthRedirectRoute } from "@/features/auth/shared/utils/getAuthRedirectRoute";
import { getProfileById } from "@/features/profile/server/getProfileById";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const result = signupSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Invalid signup data",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const { firstName, lastName, email, password } = result.data;

        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                },
            },
        });

        if (error || !data?.user) {
            return NextResponse.json({ message: "Failed to create account" }, { status: 400 });
        }

        // Supabase quirk: when email is already registered, signUp() succeeds
        // but returns a user with an empty identities array instead of an error.
        if (data.user.identities?.length === 0) {
            return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
        }

        // "Confirm email" is on in Supabase → no session yet:
        // the user must click the link in his email first (then /api/auth/confirm logs him in)
        if (!data.session) {
            return NextResponse.json({ needsConfirmation: true, email }, { status: 201 });
        }

        // getting profile after creating account to decide where to redirect user to
        const { role, status } = await getProfileById(data.user.id);

        // get the next route based on the role and status of the user
        const nextRoute = getAuthRedirectRoute(role, status);

        return NextResponse.json({ nextRoute }, { status: 201 });
    } catch (error) {
        // the real error stays in the server log; the user gets a simple message (no internal details)
        console.error("Signup API Error:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
