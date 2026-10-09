import { CoursesPage } from "@/features/courses/CoursesPage";
import { coursesQuerySchema } from "@/features/courses/schemas/coursesQuerySchema";
import { getCourses } from "@/features/courses/server/getCourses";

export const metadata = {
    title: "Courses",
    description: "Browse EduWay courses in web development, data science, design and more.",
};

type Params = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Courses({ searchParams }: Params) {
    const params = await searchParams;

    //  Validate if it's a broken URL (?page=abc) falls back to the defaults instead of crashing
    const parsed = coursesQuerySchema.safeParse(params);
    const query = parsed.success ? parsed.data : coursesQuerySchema.parse({});

    // - Start getting the courses WITHOUT await => the page shows right away,
    //    and CoursesGrid shows the card skeleton when the promise is done (STREAMING)
    const coursesPromise = getCourses(query);

    return <CoursesPage coursesPromise={coursesPromise} filtersKey={JSON.stringify(query)} />;
}
