// The address of a lesson in the player
//   getLessonHref("react-basics", "abc") → "/learn/react-basics/abc"
export const getLessonHref = (courseSlug: string, lessonId: string) => `/learn/${courseSlug}/${lessonId}`;

// The address that opens the right lesson of a course ("Go to course" / "Continue learning")
//   getCourseLearnHref("react-basics") → "/learn/react-basics"
export const getCourseLearnHref = (courseSlug: string) => `/learn/${courseSlug}`;
