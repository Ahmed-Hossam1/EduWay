import { MyCourse } from "../types";

// What a draft still needs before it can be published (the first missing thing)
//   no thumbnail → "Add a thumbnail"
//   no lessons   → "Add your first lesson"
//   all good     → "Ready to publish"
export function getDraftHint(course: Pick<MyCourse, "thumbnail_url" | "lessons_count">): string {
    if (!course.thumbnail_url) return "Add a thumbnail";
    if (course.lessons_count === 0) return "Add your first lesson";
    return "Ready to publish";
}
