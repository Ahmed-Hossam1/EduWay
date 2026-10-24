import { CourseStatus } from "@/features/courses/types";

// One row in the "My courses" list (what get_teacher_courses() returns for each course)
export type MyCourse = {
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

// Response of getMyCourses(): one page of the list (+ what the pagination needs)
export type MyCoursesResponse = {
    courses: MyCourse[];
    totalCount: number;
    pageSize: number;
};
