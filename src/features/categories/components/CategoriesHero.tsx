import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoriesSearch } from "./CategoriesSearch";

// Top of /categories: same look as the instructors hero (breadcrumb, small title, big heading)
export function CategoriesHero() {
    return (
        <section className="border-b border-border/50 bg-muted/40">
            <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
                    {/* Left: title + text */}
                    <div className="lg:col-span-7">
                        {/* Breadcrumb */}
                        <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

                        {/* Small title above the heading */}
                        <p className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                            <span className="h-px w-8 bg-primary" />
                            Explore
                        </p>

                        <h1 className="mt-3 text-3xl font-black leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                            Browse courses by category
                        </h1>

                        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                            From code to design to business: pick a topic and see every course our instructors teach
                            in it.
                        </p>

                        {/* Search */}
                        <CategoriesSearch />
                    </div>

                    {/* Right: for people who don't know what to pick yet */}
                    <div className="lg:col-span-5">
                        <Card className="gap-0 rounded-3xl bg-primary p-6 text-primary-foreground ring-0 sm:p-8">
                            <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-foreground/15">
                                <Compass className="size-5" />
                            </span>
                            <h2 className="mt-5 text-2xl font-black tracking-tight">Not sure where to start?</h2>
                            <p className="mt-2 text-sm text-primary-foreground/80">
                                See all our courses in one place, then filter by level, price and rating.
                            </p>

                            <Button variant="secondary" className="mt-7 h-11 w-full font-semibold" asChild>
                                <Link href="/courses">
                                    Browse all courses
                                    <ArrowRight />
                                </Link>
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
