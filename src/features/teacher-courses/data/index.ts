import { TeacherCoursesSort, TeacherCoursesStatus } from "../schemas/teacherCoursesQuerySchema";

// The status tabs on top of the list
export const myCoursesStatusTabs: { value: TeacherCoursesStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Drafts" },
];

export const myCoursesSortOptions: { value: TeacherCoursesSort; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "students", label: "Most students" },
    { value: "earnings", label: "Top earning" },
];
