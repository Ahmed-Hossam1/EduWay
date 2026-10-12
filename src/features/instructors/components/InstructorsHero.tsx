"use client"
import Link from "next/link";
import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// same URL helper as /courses (it works with the current page path)
import { useCoursesSearchParams } from "@/features/courses/hooks/useCoursesSearchParams";

export function InstructorsHero() {
  const { getValue, updateParams } = useCoursesSearchParams();
  const [query, setQuery] = useState<string>(getValue("q") ?? "");

  // Runs when the user presses "Search" (or Enter), not on every letter
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop the browser from reloading the page

    // empty text → null → removes q from the URL (the sort stays)
    updateParams({ q: query.trim() || null });
  };

  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-linear-to-b from-accent/70 via-background to-background">
      {/* Background decoration */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[22px_22px] opacity-60 mask-[radial-gradient(ellipse_at_top_left,black_30%,transparent_70%)]" />
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList className="text-xs font-medium">
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />} className="hover:text-primary">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Instructors</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Badge variant="accent" className="mt-5 h-auto gap-1.5 border-primary/20 px-3 py-1 font-semibold shadow-xs">
            <Sparkles />
            Every instructor is reviewed by our team
          </Badge>

          <h1 className="mt-4 text-3xl font-black leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Learn from <span className="text-primary">industry experts</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Meet the people behind EduWay courses — engineers, designers and data experts who teach what they do every day.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-7 flex max-w-xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg shadow-primary/5 sm:flex-row sm:rounded-full">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search instructors by name"
                aria-label="Search instructors"
                Size="lg"
                rounded="full"
                variant="ghost"
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                leftIcon={<Search className="size-4" />}
              />
            </div>
            <Button type="submit" rounded="full" className="h-12 px-8 font-semibold">
              Search
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
