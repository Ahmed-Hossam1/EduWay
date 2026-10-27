"use client";

import { ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CommunityTab = "reviews" | "questions";

type CourseCommunityTabsProps = {
    reviews: ReactNode; // the reviews section (a server component, streamed)
    questions: ReactNode; // the questions section (a server component, streamed)
};

// "#questions" / "#question-<id>" → "questions", "#reviews" / "#review-<id>" → "reviews", anything else → null
const getTabFromHash = (): CommunityTab | null => {
    if (window.location.hash.startsWith("#question")) return "questions";
    if (window.location.hash.startsWith("#review")) return "reviews";
    return null;
};

// tell React when the #hash changes
const subscribeToHash = (onChange: () => void) => {
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
};

/**
 * Reviews | Questions on the course page, as 2 tabs (not one under the other:
 * "Show more reviews" would push the questions far down).
 * A link with #questions / #reviews (a notification, the rating at the top) opens the right tab.
 */
export function CourseCommunityTabs({ reviews, questions }: CourseCommunityTabsProps) {
    // the tab of the #hash: the browser's url, read with useSyncExternalStore
    // (the server has no url hash → null → no hydration mismatch, then the browser value)
    const hashTab = useSyncExternalStore(subscribeToHash, getTabFromHash, () => null);
    const [clickedTab, setClickedTab] = useState<CommunityTab | null>(null); // the tab the user clicked
    const tabsRef = useRef<HTMLDivElement>(null);

    // a #hash link clicked on this page (the rating at the top → #reviews) → the #hash wins again + scroll there
    // (the page opened with a #hash → the list scrolls itself when it shows: useScrollToComment)
    useEffect(() => {
        const onHashChange = () => {
            setClickedTab(null);
            tabsRef.current?.scrollIntoView();
        };

        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    const tab = clickedTab ?? hashTab ?? "reviews";

    return (
        <div ref={tabsRef} className="scroll-mt-24">
            <Tabs value={tab} onValueChange={(value) => setClickedTab(value as CommunityTab)} className="gap-6">
                <TabsList variant="line" className="w-full justify-start border-b border-border">
                    <TabsTrigger value="reviews" className="flex-none px-3">
                        Reviews
                    </TabsTrigger>
                    <TabsTrigger value="questions" className="flex-none px-3">
                        Questions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="reviews">{reviews}</TabsContent>
                <TabsContent value="questions">{questions}</TabsContent>
            </Tabs>
        </div>
    );
}
