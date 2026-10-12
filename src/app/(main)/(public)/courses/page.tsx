import { CoursesPage } from "@/features/courses/CoursesPage";
import { coursesQuerySchema } from "@/features/courses/schemas/coursesQuerySchema";
import { getCourses } from "@/features/courses/server/getCourses";
import { getCategories } from "@/features/courses/server/getCategories";

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

    // Categories for the filters sidebar (same idea: no await)
    const categoriesPromise = getCategories();

    return (
        <CoursesPage
            coursesPromise={coursesPromise}
            categoriesPromise={categoriesPromise}
            filtersKey={JSON.stringify(query)}
        />
    );
}
