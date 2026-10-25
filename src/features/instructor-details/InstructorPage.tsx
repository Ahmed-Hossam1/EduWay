import { Suspense } from "react";
import { CoursesSkeleton } from "@/features/courses/components/CoursesSkeleton";
import { CourseCard } from "@/features/courses/types";
import { getInstructorName } from "@/features/courses/utils/format";
import { Instructor, InstructorStats } from "./types";
import { InstructorHero } from "./components/InstructorHero";
import { InstructorAbout } from "./components/InstructorAbout";
import { InstructorCourses } from "./components/InstructorCourses";

type InstructorPageProps = {
    instructor: Instructor;
    coursesPromise: Promise<CourseCard[]>;
    statsPromise: Promise<InstructorStats>;
};

export function InstructorPage({ instructor, coursesPromise, statsPromise }: InstructorPageProps) {
    return (
        <>
            <InstructorHero instructor={instructor} statsPromise={statsPromise} />

            <div className="container mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <InstructorAbout profile={instructor.profile} />

                <Suspense fallback={<CoursesSkeleton />}>
                    <InstructorCourses coursesPromise={coursesPromise} instructorName={getInstructorName(instructor)} />
                </Suspense>
            </div>
        </>
    );
}
