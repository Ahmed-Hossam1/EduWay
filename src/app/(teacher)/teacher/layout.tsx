/**
 * Every /teacher/... page + the @modal slot ("View as student": the lesson player in a modal, null when closed).
 *
 * Why here and not in app/(teacher)/layout.tsx?
 *   An intercepting route catches links clicked from pages UNDER the folder of its layout.
 *   In app/(teacher) (a route group = the root of the site) it caught /learn links clicked from ANY page
 *   (the course page, My learning...) → the teacher layout guard sent students to "/".
 *   Here it only catches links clicked from /teacher/... pages.
 */
export default function TeacherPagesLayout({ children, modal }: LayoutProps<"/teacher">) {
    return (
        <>
            {children}
            {/* "View as student" opens here, ON TOP of the page you were on */}
            {modal}
        </>
    );
}
