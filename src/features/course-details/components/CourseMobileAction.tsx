"use client";
import { EnrollButton } from "@/features/enrollments/components/EnrollButton";
import { useIsCourseOwner } from "@/features/enrollments/hooks/useIsCourseOwner";
import { CourseOwnerNotice } from "@/features/enrollments/components/CourseOwnerNotice";

type CourseMobileActionProps = {
    courseId: string;
    price: number;
    instructorId: string;
};

// The button of the mobile bar: "Enroll" for everyone, "Go to dashboard" for the course teacher
export function CourseMobileAction({ courseId, price, instructorId }: CourseMobileActionProps) {
    const isOwner = useIsCourseOwner(instructorId);

    if (isOwner) {
        return <CourseOwnerNotice compact className="w-auto flex-1 sm:flex-none sm:px-10" />;
    }

    return <EnrollButton courseId={courseId} price={price} className="w-auto flex-1 sm:flex-none sm:px-10" />;
}
