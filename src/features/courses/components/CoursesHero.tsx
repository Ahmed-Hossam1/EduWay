"use client"
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Search, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { coursesHeroStats, coursesPopularTopics } from "../data";
import { useState } from "react";
import { useCoursesSearchParams } from "../hooks/useCoursesSearchParams";

export function CoursesHero() {
  const { getValue, updateParams } = useCoursesSearchParams();
  const [query, setQuery] = useState<string>(getValue("q") ?? "");

  // Runs when the user presses "Search" (or Enter), not on every letter
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop the browser from reloading the page

    // empty text → null → removes q from the URL (the other filters stay)
    updateParams({ q: query.trim() || null });
  };

  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-linear-to-b from-accent/70 via-background to-background">
      {/* Background decoration */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[22px_22px] opacity-60 mask-[radial-gradient(ellipse_at_top_left,black_30%,transparent_70%)]" />
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: copy + search + topics */}
          <div className="lg:col-span-7">
            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList className="text-xs font-medium">
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/" />} className="hover:text-primary">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Courses</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Badge variant="accent" className="mt-5 h-auto gap-1.5 border-primary/20 px-3 py-1 font-semibold shadow-xs">
              <Sparkles />
              New courses added every week
            </Badge>

            <h1 className="mt-4 text-3xl font-black leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Find the right course to{" "}
              <span className="relative whitespace-nowrap text-primary">
                grow your skills
                <svg aria-hidden viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-2.5 w-full text-primary/30">
                  <path d="M2 9 C 50 2, 150 2, 198 9" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Learn from industry experts at your own pace, practice with real projects and earn certificates that move your career forward.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="mt-7 flex max-w-xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg shadow-primary/5 sm:flex-row sm:rounded-full">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="What do you want to learn today?"
                  aria-label="Search courses"
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

            {/* Popular topics */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <TrendingUp className="size-3.5" />
                Popular:
              </span>
              {coursesPopularTopics.map((topic) => (
                <Badge
                  key={topic.slug}
                  variant="outline"
                  render={<Link href={`/courses?category=${topic.slug}`} />}
                  className="h-auto bg-background/80 px-3 py-1 hover:border-primary/50 hover:text-primary"
                >
                  {topic.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right: stats */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {coursesHeroStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={stat.id}
                    className={`gap-0 rounded-2xl bg-card/90 p-4 shadow-sm backdrop-blur transition-shadow hover:ring-primary/40 sm:p-5 ${index % 2 === 1 ? "lg:translate-y-6" : ""}`}
                  >
                    <div className={`flex size-10 items-center justify-center rounded-xl ${stat.color}`}>
                      <Icon className="size-5" />
                    </div>
                    <p className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl">{stat.value}</p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground sm:text-sm">{stat.label}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
