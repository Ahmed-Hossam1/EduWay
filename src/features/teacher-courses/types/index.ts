import { Course } from "@/features/courses/types";

// One row in the "My courses" list (what get_teacher_courses() returns for each course)
export type TeacherCourse = Pick<
    Course,
    | "id"
    | "title"
    | "slug"
    | "status"
    | "thumbnail_url"
    | "price"
    | "currency"
    | "lessons_count"
    | "students_count"
    | "created_at"
> & {
    earnings: number; // all the money of this course (paid orders)
    newStudentsThisWeek: number;
};

// Response of getTeacherCourses(): one page of the list (+ what the pagination needs)
export type TeacherCoursesResponse = {
    courses: TeacherCourse[];
    totalCount: number;
    pageSize: number;
};
