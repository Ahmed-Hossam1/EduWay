"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Input from "@/components/ui/input";
import { ArrowRight, Check, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
// same URL helper as /courses (it works with the current page path)
import { useCoursesSearchParams } from "@/features/courses/hooks/useCoursesSearchParams";
import { highlights, teachPerks } from "../data";



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
    <section className="border-b border-border/50 bg-muted/40">
      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: title + search + highlights */}
          <div className="lg:col-span-7">
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

            {/* Small title above the heading */}
            <p className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="h-px w-8 bg-primary" />
              Our instructors
            </p>

            <h1 className="mt-3 text-3xl font-black leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              The experts behind every EduWay course
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Engineers, designers and data experts who teach what they do every day. Find your next mentor.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="mt-7 flex max-w-xl gap-2">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="Search by name"
                  aria-label="Search instructors"
                  Size="lg"
                  className="bg-background"
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                  leftIcon={<Search className="size-4" />}
                />
              </div>
              <Button type="submit" className="h-12 px-6 font-semibold">
                Search
              </Button>
            </form>

            {/* Highlights */}
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {highlights.map((item) => (
                <li key={item.label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <item.icon className="size-4 text-primary" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: "Teach on EduWay" card */}
          <div className="lg:col-span-5">
            <Card className="gap-0 rounded-3xl bg-primary p-6 text-primary-foreground ring-0 sm:p-8">
              <h2 className="text-2xl font-black tracking-tight">Teach on EduWay</h2>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Are you an expert? Join our instructors and start teaching today.
              </p>

              <ul className="mt-5 space-y-3">
                {teachPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
                      <Check className="size-3" />
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>

              <Button
                variant="secondary"
                className="mt-7 h-11 w-full font-semibold"
                nativeButton={false}
                render={<Link href="/auth/signup" />}
              >
                Become an instructor
                <ArrowRight />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
