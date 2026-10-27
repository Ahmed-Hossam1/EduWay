import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPlayerPage } from "@/features/learn/LessonPlayerPage";
import { getLessonPlayer } from "@/features/learn/server/getLessonPlayer";
import { LESSON_TABS } from "@/features/learn/types";

type Params = {
    params: Promise<{ slug: string; lessonId: string }>;
};

type PageSearchParams = {
    searchParams: Promise<{ tab?: string }>;
};

// "What is React? · React for Beginners"
export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug, lessonId } = await params;
    const player = await getLessonPlayer(slug, lessonId); // cached → the page doesn't ask again

    if (!player) return { title: "Lesson not found" };

    return {
        title: `${player.lesson.title} · ${player.course.title}`,
        robots: { index: false }, // a lesson page is private
    };
}

// /learn/[slug]/[lessonId] → the lesson player (proxy.ts: /learn needs a login)
export default async function LessonPlayer({ params, searchParams }: Params & PageSearchParams) {
    const { slug, lessonId } = await params;
    const { tab } = await searchParams;

    // ?tab=qa → the Q&A tab opens first (a notification "replied to your question" links here)
    const defaultTab = LESSON_TABS.find((name) => name === tab);

    // the database decides what you can see (enrolled / teacher / free preview)
    const player = await getLessonPlayer(slug, lessonId);
    if (!player) notFound();

    return <LessonPlayerPage player={player} defaultTab={defaultTab} />;
}
