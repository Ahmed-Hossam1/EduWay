import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoryRow } from "@/features/courses/types";
import { CourseDetails, CourseTag, PrerequisiteCourse } from "../types";

/**
 * Server only: one published course with everything the details page needs
 * (instructor, categories, tags, prerequisite courses, sections + lessons).
 * Returns null when the slug doesn't exist → the page shows 404.
 *
 * cache() → generateMetadata and the page call it with the same slug,
 * but the database is asked only once per request.
 */
export const getCourseBySlug = cache(async (slug: string): Promise<CourseDetails | null> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("courses")
        .select(`
            *,
            instructor:profiles!courses_instructor_id_fkey (
                id, first_name, last_name, avatar_url,
                profile:instructor_profiles ( headline, bio )
            ),
            course_categories ( category:categories ( id, name, slug ) ),
            course_tags ( tag:tags ( id, name, slug ) ),
            prerequisites:course_requirements!course_requirements_course_id_fkey (
                course:courses!course_requirements_required_course_id_fkey ( id, title, slug, thumbnail_url )
            ),
            sections ( id, title, position, lessons ( id, title, duration_seconds, position, is_preview ) )
        `)
        .eq("slug", slug)
        .eq("status", "published")
        // sort the curriculum: sections by position, and the lessons inside each section
        .order("position", { referencedTable: "sections" })
        .order("position", { referencedTable: "sections.lessons" })
        .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    // [{ category: {...} }] => [{...}]   (same for tags and prerequisites)
    const { course_categories, course_tags, prerequisites, ...course } = data;

    return {
        ...course,
        categories: course_categories.map((item: { category: CategoryRow }) => item.category),
        tags: course_tags.map((item: { tag: CourseTag }) => item.tag),
        prerequisites: prerequisites.map((item: { course: PrerequisiteCourse }) => item.course),
    } as CourseDetails;
});
