import Link from "next/link";
import { Suspense } from "react";
import { Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getInstructorName } from "@/features/courses/utils/format";
import { Instructor, InstructorStats } from "../types";
import { EXPERIENCE_LABELS } from "../utils/format";
import { InstructorSocialLinks } from "./InstructorSocialLinks";
import { InstructorStatsCards, InstructorStatsCardsSkeleton } from "./InstructorStatsCards";

type InstructorHeroProps = {
    instructor: Instructor;
    statsPromise: Promise<InstructorStats>;
};

export function InstructorHero({ instructor, statsPromise }: InstructorHeroProps) {
    const name = getInstructorName(instructor);
    const profile = instructor.profile;

    return (
        <section className="relative overflow-hidden border-b border-border/50 bg-linear-to-b from-accent/70 via-background to-background">
            <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-primary/15 blur-3xl"
            />

            <div className="container relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_420px] lg:gap-12 lg:px-8">
                <div className="min-w-0">
                    <Breadcrumb>
                        <BreadcrumbList className="text-xs font-medium">
                            <BreadcrumbItem>
                                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Instructors</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
                        <Avatar className="size-24 ring-4 ring-background shadow-lg">
                            {instructor.avatar_url && <AvatarImage src={instructor.avatar_url} alt={name} />}
                            <AvatarFallback className="text-3xl">{name[0]}</AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <Badge variant="accent" className="h-auto px-2.5 py-0.5">
                                Instructor
                            </Badge>
                            <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                                {name}
                            </h1>
                            {profile?.headline && (
                                <p className="mt-1.5 text-base text-muted-foreground sm:text-lg">{profile.headline}</p>
                            )}
                            {profile?.experience_level && (
                                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Briefcase className="size-4" />
                                    {EXPERIENCE_LABELS[profile.experience_level]}
                                </p>
                            )}
                        </div>
                    </div>

                    {profile && (
                        <div className="mt-6">
                            <InstructorSocialLinks profile={profile} />
                        </div>
                    )}
                </div>

                {/* Stats: computed from his courses → streamed */}
                <Suspense fallback={<InstructorStatsCardsSkeleton />}>
                    <InstructorStatsCards statsPromise={statsPromise} />
                </Suspense>
            </div>
        </section>
    );
}
