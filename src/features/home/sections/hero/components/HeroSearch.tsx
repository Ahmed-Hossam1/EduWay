"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroPopularTopics } from "../../../data";
import Input from "@/components/ui/input";

export function HeroSearch() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // In real app: router.push(`/courses?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="w-full max-w-xl space-y-4">
      {/* Search Bar Input Form */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-card rounded-full border border-border/80 shadow-sm hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all p-1.5"
      >
        <div className="pl-3.5 pr-2 text-muted-foreground">
          <Search className="size-5" />
        </div>
        <Input
          type="text"
          variant={"ghost"}
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to learn today?"
          className=" focus-within:ring-0!"
        />
        <Button
          type="submit"
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary-hover px-6 sm:px-8 py-2 text-sm font-semibold shrink-0"
        >
          Search
        </Button>
      </form>

      {/* Popular Topic Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground">
          Popular:
        </span>
        {heroPopularTopics.map((topic) => (
          <Button
            variant={"outline"}
            key={topic}
            onClick={() => setQuery(topic)}
            className="rounded-full border hover:bg-primary hover:text-primary-foreground hover:transition border-border/60 transition-all font-medium"
          >
            {topic}
          </Button>
        ))}
      </div>
    </div>
  );
}
