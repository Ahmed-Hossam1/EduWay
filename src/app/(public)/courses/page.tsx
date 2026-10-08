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
    // 1- Read the URL (?category=web-dev&sort=rating&page=2)
    const params = await searchParams;

    // 2- Validate it — a broken URL (?page=abc) falls back to the defaults instead of crashing
    const parsed = coursesQuerySchema.safeParse(params);
    const query = parsed.success ? parsed.data : coursesQuerySchema.parse({});

    // 3- Get the courses directly from the database (server component → no API request)
    const data = await getCourses(query);

    return <CoursesPage data={data} />;
}
