import { HomePage } from "@/features/home/HomePage";
import { getCourses } from "@/features/courses/server/getCourses";

const FEATURED_COURSES_COUNT = 5;

export default function Home() {
    // the 5 most popular published courses — no await: the hero shows right away, the cards stream in
    const featuredCoursesPromise = getCourses({ sort: "popular" }, FEATURED_COURSES_COUNT).then(
        (result) => result.courses,
    );

    return <HomePage featuredCoursesPromise={featuredCoursesPromise} />;
}
