import { LessonPlayerSkeleton } from "@/features/learn/components/skeleton";

// Next.js shows this while the lesson page loads: ONLY this page waits (the navbar + footer show right away)
export default function LessonPlayerLoading() {
    return <LessonPlayerSkeleton />;
}
