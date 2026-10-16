"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { heroPopularTopics } from "../../../data";

export function HeroSearch() {
    const params = useQueryParams();
    const [searchValue, setSearchValue] = useState<string>(params.get("q") || "");
    const router = useRouter();

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (!searchValue) return;
        params.set("q", searchValue);
        router.push(`/courses?q=${searchValue}`);
    };

    return (
        <div className="w-full max-w-xl space-y-4">
            {/* Search Bar Input Form */}
            <form
                onSubmit={handleSearch}
                className="relative flex items-center bg-card rounded-full border border-border/80 shadow-sm hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all p-1.5"
            >
                <div className="pl-3.5 pr-2 text-muted-foreground">
                    <Search className="size-5" />
                </div>
                <Input
                    type="text"
                    variant="plain"
                    fullWidth
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="What do you want to learn today?"
                />
                <Button
                    type="submit"
                    rounded="full"
                    className="bg-primary text-primary-foreground hover:bg-primary-hover px-6 sm:px-8 py-2 text-sm font-semibold shrink-0"
                >
                    Search
                </Button>
            </form>

            {/* Popular Topic Chips */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Popular:</span>
                {heroPopularTopics.map((topic) => (
                    <Button
                        key={topic.slug}
                        asChild
                        variant="outline"
                        size="lg"
                        rounded="full"
                        aria-label="Search courses"
                        className="h-auto bg-background/80hover:border-primary/50 hover:text-primary"
                    >
                        <Link href={`/courses?category=${topic.slug}`}>{topic.name}</Link>
                    </Button>
                ))}
            </div>
        </div>
    );
}
