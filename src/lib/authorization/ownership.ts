import { UserRole } from "@/features/profile/types";

// The only part of a course we need here: who made it
type OwnedCourse = {
    instructor_id: string;
};

// Is this user the teacher who made this course?
export function isCourseOwner(userId: string, course: OwnedCourse): boolean {
    return course.instructor_id === userId;
}

/**
 * Can this user change THIS course (update it, delete it, add sections / lessons)?
 *   the teacher who made it → yes
 *   the admin               → yes (any course)
 *   anyone else             → no
 *
 * Use it AFTER hasPermission() (permission.ts):
 *   hasPermission   → "can he edit courses at all?"   (role + status)
 *   canManageCourse → "can he edit this one?"          (owner)
 */
export function canManageCourse(userId: string, role: UserRole | null, course: OwnedCourse): boolean {
    // the admin can manage every course
    if (role === "admin") return true;

    return isCourseOwner(userId, course);
}
