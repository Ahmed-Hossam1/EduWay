import { z } from "zod";

export const TEACHER_COURSES_PAGE_SIZE = 10;

export const teacherCoursesStatusValues = ["all", "published", "draft"] as const;
export const teacherCoursesSortValues = ["newest", "students", "earnings"] as const;

// no ?status / ?sort in the URL → these (the schema and the toolbar use them)
export const DEFAULT_TEACHER_COURSES_STATUS = "all";
export const DEFAULT_TEACHER_COURSES_SORT = "newest";

// Validates the search params of /teacher/courses
//   ?status=draft&q=react&sort=students&page=2
// A broken value (?page=abc, ?status=xyz) → the page falls back to the defaults
export const teacherCoursesQuerySchema = z.object({
    status: z.enum(teacherCoursesStatusValues).default(DEFAULT_TEACHER_COURSES_STATUS),
    q: z.string().trim().optional(),
    sort: z.enum(teacherCoursesSortValues).default(DEFAULT_TEACHER_COURSES_SORT),
    page: z.coerce.number().int().min(1).default(1),
});

export type TeacherCoursesQuery = z.infer<typeof teacherCoursesQuerySchema>;
export type TeacherCoursesStatus = (typeof teacherCoursesStatusValues)[number];
export type TeacherCoursesSort = (typeof teacherCoursesSortValues)[number];
