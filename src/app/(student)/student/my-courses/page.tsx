import { MyCoursesPage } from "@/features/enrollments/MyCoursesPage";
import { getMyCourses } from "@/features/enrollments/server/getMyCourses";

export const metadata = {
    title: "My courses",
    robots: { index: false }, // a private page => Google shouldn't show it
};

// Protected in proxy.ts => only logged-in users get here
export default function MyCourses() {
    // no await => the title shows right away, the courses are streamed
    const myCoursesPromise = getMyCourses();

    return <MyCoursesPage myCoursesPromise={myCoursesPromise} />;
}
