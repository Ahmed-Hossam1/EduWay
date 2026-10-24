import { CourseStatus } from "@/features/courses/types";

// One row in the "My courses" list (what get_teacher_courses() returns for each course)
export type TeacherCourse = {
    id: string;
    title: string;
    slug: string;
    status: CourseStatus;
    thumbnail_url: string | null;
    price: number;
    currency: string;
    lessons_count: number;
    students_count: number;
    created_at: string;
    earnings: number; // all the money of this course (paid orders)
    newStudentsThisWeek: number;
};

// Response of getTeacherCourses(): one page of the list (+ what the pagination needs)
export type TeacherCoursesResponse = {
    courses: TeacherCourse[];
    totalCount: number;
    pageSize: number;
};
