import { signupSchema, signupSchemaType } from "@/features/(auth)/signup/schema/schema";
import { AuthRole } from "@/features/(auth)/signup/types";
import { getAuthRedirectRoute } from "@/services/auth/getAuthRedirectRoute";
import { getProfileService } from "@/services/auth/getProfile";
import { signupService } from "@/services/auth/signup/signupService";
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

        const { firstName, lastName, email, password, selectedRole } = result.data
        // sign up service 
        const { user } = await signupService({ firstName, lastName, email, password, selectedRole });

        if (!user || !user?.id) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 400 }
            );
        }

        // getting profile after creating account to decide where to redirect user to 
        const { role, status } = await getProfileService(user.id);

        // get the next route based on the role and status of the user
        const nextRoute = getAuthRedirectRoute(role, status)

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