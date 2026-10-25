import { PublishMissingKey } from "../types";

export type EditTab = "details" | "curriculum" | "pricing" | "publish";

// The tabs of /teacher/courses/[courseId]/edit (each tab is its own page)
export const EDIT_TABS: { tab: EditTab; label: string; path: string }[] = [
    { tab: "details", label: "Details", path: "" },
    { tab: "curriculum", label: "Curriculum", path: "/curriculum" },
    { tab: "pricing", label: "Pricing", path: "/pricing" },
    { tab: "publish", label: "Publish", path: "/publish" },
];

// The publish checklist: what each missing key means + where the teacher fixes it
export const PUBLISH_CHECKLIST: { key: PublishMissingKey; label: string; tab: EditTab }[] = [
    { key: "short_description", label: "Add a short description", tab: "details" },
    { key: "description", label: "Write the course description", tab: "details" },
    { key: "thumbnail", label: "Upload a course image", tab: "details" },
    { key: "category", label: "Choose a category", tab: "details" },
    { key: "learning_outcomes", label: "Add what students will learn", tab: "details" },
    { key: "lesson_videos", label: "Upload a video for every lesson", tab: "curriculum" },
];

