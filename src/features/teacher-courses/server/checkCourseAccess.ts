import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";
import { Permission, hasPermission } from "@/lib/authorization/permission";
import { canManageCourse } from "@/lib/authorization/ownership";
import { CourseStatus } from "@/features/courses/types";

type CourseAccess =
    | { ok: true; course: { id: string; status: CourseStatus } }
    | { ok: false; response: NextResponse };

const deny = (message: string, status: number): CourseAccess => ({
    ok: false,
    response: NextResponse.json({ message }, { status }),
});

/**
 *checks if the user is logged in and has the permission to change the course
 * and checks if the course exist and is owned by the user that is trying to access it
 * The checks every "change my course" API does, in order:
 *   1- valid id        → 400
 *   2- logged in       → 401
 *   3- the permission  → 403 (an approved teacher, or the admin)
 *   4- the course      → 404
 *   5- HIS course      → 403 (the owner, or the admin)
 *
 *   const access = await checkCourseAccess(courseId, "course:delete");
 *   if (!access.ok) return access.response;
 *   access.course.status // "draft"
 */
export async function checkCourseAccess(courseId: string, permission: Permission): Promise<CourseAccess> {
    if (!z.uuid().safeParse(courseId).success) return deny("A valid courseId is required", 400);

    const auth = await requireUser();
    if (!auth.ok) return { ok: false, response: auth.response }; // 401
    const { supabase, user } = auth;

    const { data: profile } = await supabase.from("profiles").select("role, status").eq("id", user.id).single();
    const role = profile?.role ?? null;
    if (!hasPermission(role, profile?.status ?? null, permission)) {
        return deny("You can't change courses", 403);
    }

    const { data: course } = await supabase
        .from("courses")
        .select("id, status, instructor_id")
        .eq("id", courseId)
        .maybeSingle();
    if (!course) return deny("Course not found", 404);

    if (!canManageCourse(user.id, role, course)) {
        return deny("You can only change your own courses", 403);
    }

    return { ok: true, course: { id: course.id, status: course.status } };
}
