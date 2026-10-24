import { formatCompactNumber } from "@/features/courses/utils/format";
import { InstructorStats } from "../types";

/**
 * The stats as the UI shows them (the instructor card AND the instructor page use it).
 *   { coursesCount: 3, studentsCount: 12400, averageRating: 4.73, ratingsCount: 210 }
 *   → { courses: "3", students: "12.4K", rating: "4.7", ratings: "210" }
 * No ratings yet → rating "—".
 */
export const formatInstructorStats = (stats: InstructorStats) => ({
    courses: String(stats.coursesCount),
    students: formatCompactNumber(stats.studentsCount),
    rating: stats.ratingsCount > 0 ? stats.averageRating.toFixed(1) : "—",
    ratings: formatCompactNumber(stats.ratingsCount),
});
