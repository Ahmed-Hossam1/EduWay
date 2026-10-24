import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInstructorName } from "@/features/courses/utils/format";
import { InstructorPage } from "@/features/instructor-details/InstructorPage";
import { getInstructorById } from "@/features/instructor-details/server/getInstructorById";
import { getInstructorCourses } from "@/features/instructor-details/server/getInstructorCourses";
import { getInstructorStats } from "@/features/instructor-details/server/getInstructorStats";

type Params = {
    params: Promise<{ id: string }>;
};

// SEO: "Ahmed Hossam — Software Engineer & Online Instructor | EduWay"
export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { id } = await params;
    const instructor = await getInstructorById(id); // cached =>  the page doesn't ask again

    if (!instructor) return { title: "Instructor not found" };

    const name = getInstructorName(instructor);
    const headline = instructor.profile?.headline;

    return {
        title: headline ? `${name} — ${headline}` : name,
        description: instructor.profile?.bio?.slice(0, 160) ?? `Courses by ${name} on EduWay.`,
        openGraph: {
            title: headline ? `${name} — ${headline}` : name,
            description: instructor.profile?.bio?.slice(0, 160) ?? `Courses by ${name} on EduWay.`,
            type: "website",
            images: [instructor.avatar_url ?? "/"],
        },
        twitter: {
            title: headline ? `${name} — ${headline}` : name,
            description: instructor.profile?.bio?.slice(0, 160) ?? `Courses by ${name} on EduWay.`,
            images: [instructor.avatar_url ?? "/"],
        },
    };
}

export default async function Instructor({ params }: Params) {
    const { id } = await params;

    // 1- The teacher: we wait, because we need him for the 404 and the whole page
    const instructor = await getInstructorById(id);
    if (!instructor) notFound();

    // 2- His courses + his numbers: no await => both start now and are streamed
    const coursesPromise = getInstructorCourses(instructor.id);
    const statsPromise = getInstructorStats(instructor.id);

    return <InstructorPage instructor={instructor} coursesPromise={coursesPromise} statsPromise={statsPromise} />;
}
