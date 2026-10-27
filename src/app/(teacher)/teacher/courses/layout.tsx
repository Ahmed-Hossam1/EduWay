/**
 * Every /teacher/courses/... page + the @modal slot ("View as student": the lesson player in a modal).
 *
 * Why here and not in app/(teacher)/teacher/layout.tsx?
 *   An intercepting route catches /learn links clicked from the pages UNDER the folder of its layout.
 *   In /teacher it caught them on EVERY dashboard page (a notification link → the modal opened).
 *   Here it only catches the /learn links of the courses pages ("View as student" on My courses).
 *   The notifications bell opens /learn links with a full page load → never caught.
 */
export default function TeacherCoursesLayout({ children, modal }: LayoutProps<"/teacher/courses">) {
    return (
        <>
            {children}
            {/* "View as student" opens here, ON TOP of the page you were on */}
            {modal}
        </>
    );
}
