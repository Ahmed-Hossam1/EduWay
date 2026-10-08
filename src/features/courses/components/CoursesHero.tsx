"use client"
import { Search } from "lucide-react";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function CoursesHero() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

  useEffect(() => {
    if (searchQuery) {
      searchParams.set()
    }
  }, [searchQuery])
  return (
    <section className="border-b border-border/50 bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            300+ courses
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Explore our <span className="text-primary">courses</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Learn from industry experts at your own pace and build skills that move your career forward.
          </p>
        </div>

        {/* Search */}
        <form className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="What do you want to learn today?"
              aria-label="Search courses"
              Size="lg"
              rounded="full"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              leftIcon={<Search className="size-4" />}
            />
          </div>
          <Button type="submit" className="h-12 rounded-full px-8 font-semibold">
            Search
          </Button>
        </form>
      </div>
    </section>
  );
}
