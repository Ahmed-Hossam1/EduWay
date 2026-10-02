import { loginSchema } from "@/features/(auth)/login/schema/loginSchema";
import { getProfileService } from "@/services/auth/getProfile";
import { loginService } from "@/services/auth/login/login";
import { NextResponse } from "next/server";

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
        const { user } = await loginService({ email, password });

        if (!user?.id) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Step 5: Get the user's profile to determine redirect
        const { role, status } = await getProfileService(user.id);

        // Steps 6 & 7: Determine next route based on role and status
        let next = "/";

        if (role === "teacher") {
            switch (status) {
                case "onboarding":
                    next = "/onboarding";
                    break;
                case "waiting":
                    next = "/waiting";
                    break;
                case "approved":
                    next = "/dashboard";
                    break;
                case "rejected":
                    next = "/rejected";
                    break;
            }
        }

        if (role === "student") {
            next = "/";
        }

        // Step 8: Return next route to frontend
        return NextResponse.json(
            { success: true, next },
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
