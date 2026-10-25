"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { EDIT_TABS, } from "../data/editTabs";
import { getEditHref } from "../utils";

type CourseEditTabsProps = {
    courseId: string;
};

// Details · Pricing · Publish — every tab is its own page (the URL shows the open tab)
export function CourseEditTabs({ courseId }: CourseEditTabsProps) {
    const pathname = usePathname();

    return (
        <nav aria-label="Course sections" className="flex gap-1 border-b border-border">
            {EDIT_TABS.map(({ tab, label }) => {
                const href = getEditHref(courseId, tab);
                const isActive = pathname === href;

                return (
                    <Link
                        key={tab}
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                            "-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
                            isActive
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
