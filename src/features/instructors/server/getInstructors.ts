import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getInstructorName } from "@/features/courses/utils/format";
import { computeInstructorStats } from "@/features/instructor-details/utils/format";
import { GetInstructorsParams, InstructorListItem, InstructorSort } from "../types";

// A sort function for every sort option (biggest number first)
const sorters: Record<InstructorSort, (a: InstructorListItem, b: InstructorListItem) => number> = {
    students: (a, b) => b.stats.studentsCount - a.stats.studentsCount,
    rating: (a, b) => b.stats.averageRating - a.stats.averageRating,
    courses: (a, b) => b.stats.coursesCount - a.stats.coursesCount,
};

// What one row from Supabase looks like
type InstructorRow = {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    profile: { headline: string | null; skills: string[] } | null;
    courses: { students_count: number; rating_avg: number; rating_count: number }[];
};

/**
 * Server only: all approved teachers with their stats, after search and sort.
 * Used by the /instructors page.
 */
export const getInstructors = async (params: GetInstructorsParams): Promise<InstructorListItem[]> => {
    const { q, sort = "students" } = params;

    // 1- Get the approved teachers + their profile + the numbers of their published courses
    //    (explicit FK hint => profiles and courses are linked by more than one table)
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("profiles")
        .select(
            `
            id, first_name, last_name, avatar_url,
            profile:instructor_profiles ( headline, skills ),
            courses:courses!courses_instructor_id_fkey ( students_count, rating_avg, rating_count )
        `,
        )
        .eq("role", "teacher")
        .eq("status", "approved")
        .eq("courses.status", "published");

    if (error) throw error;

    // 2- Turn every row into a card item (stats computed from the courses)
    const instructors: InstructorListItem[] = (data as unknown as InstructorRow[]).map((row) => ({
        id: row.id,
        first_name: row.first_name,
        last_name: row.last_name,
        avatar_url: row.avatar_url,
        headline: row.profile?.headline ?? null,
        skills: row.profile?.skills ?? [],
        stats: computeInstructorStats(row.courses),
    }));

    // 3- Search by name
    const filtered = instructors.filter((instructor) => {
        if (q && !getInstructorName(instructor).toLowerCase().includes(q.toLowerCase())) return false;
        return true;
    });

    // 4- Sort (copy first so we don't change the original array)
    return [...filtered].sort(sorters[sort]);
};
