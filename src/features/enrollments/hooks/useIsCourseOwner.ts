import { useProfile } from "@/features/profile/hooks/useProfile";
import { isCourseOwner } from "@/lib/authorization/ownership";

/**
 * Is the logged-in user the teacher who made this course?
 * (a guest or a student → false)
 *
 *   const isOwner = useIsCourseOwner(course.instructor.id);
 */
export const useIsCourseOwner = (instructorId: string): boolean => {
    const { data: profile } = useProfile();
    if (!profile) return false;

    return isCourseOwner(profile.id, { instructor_id: instructorId });
};
