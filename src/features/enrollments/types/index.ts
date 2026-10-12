import { Course } from "@/features/courses/types";

// Same values as the Postgres enum enrollment_status
export type EnrollmentStatus = "active" | "completed" | "refunded";

// GET /api/enrollments → only the ids (light): enough to switch the buttons to "Go to course"
export interface EnrollmentIdsResponse {
  courseIds: string[];
}

// One course on the "My courses" page
export interface EnrolledCourse {
  course: Course;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedLessons: number;
  progressPercent: number; // 0 → 100
}
