import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { coursesQuerySchema } from "@/features/courses/schemas/coursesQuerySchema";
import { getCourses } from "@/features/courses/server/getCourses";

// GET /api/courses?q=react&category=web-dev,design&level=beginner&sort=rating&page=2
export async function GET(request: NextRequest) {
    try {
        // 1- Read the search params from the URL
        const params = Object.fromEntries(request.nextUrl.searchParams);

        // 2- Validate them (wrong sort / page=abc → 400)
        const result = coursesQuerySchema.safeParse(params);
        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid query params", details: z.flattenError(result.error).fieldErrors },
                { status: 400 }
            );
        }

        // 3- Get the page of courses
        const data = await getCourses(result.data);

        return NextResponse.json(data, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
