import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type InstructorApplication = {
    status: "pending" | "approved" | "rejected";
    reason: string | null; // why the admin rejected it (null when not rejected)
    submitted_at: string;
    reviewed_at: string | null;
};

/**
 * Server only: the LAST application of this teacher (the newest one), or null if he never applied.
 * RLS lets a teacher read only his own applications.
 */
export const getLatestApplication = async (userId: string): Promise<InstructorApplication | null> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("instructor_applications")
        .select("status, reason, submitted_at, reviewed_at")
        .eq("profile_id", userId)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle(); // 0 rows → null (not an error)

    if (error) throw error;

    return data as InstructorApplication | null;
};
