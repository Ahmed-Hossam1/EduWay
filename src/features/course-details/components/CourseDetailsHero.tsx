import Link from "next/link";
import { BookOpen, CalendarClock, Clock, Globe, Users } from "lucide-react";
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
import { RatingStars } from "@/components/shared/RatingStars";
import { CourseThumbnail } from "@/features/courses/components/CourseThumbnail";
import { COURSE_BADGES, formatCompactNumber, formatDuration, getInstructorName, getCourseLevelLabel } from "@/features/courses/utils/format";
import { CourseDetails } from "../types";

type CourseDetailsHeroProps = {
    course: CourseDetails;
};

export function CourseDetailsHero({ course }: CourseDetailsHeroProps) {
    const badge = course.badge ? COURSE_BADGES[course.badge] : null;
    const category = course.categories[0];
    const instructorName = getInstructorName(course.instructor);

    // "2026-10-08T17:14:45Z" => "October 2026"
    const lastUpdated = new Date(course.updated_at).toLocaleDateString("en", { month: "long", year: "numeric" });

    return (
        <section className="relative overflow-hidden border-b border-border/50 bg-linear-to-b from-accent/70 via-background to-background">
            <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-primary/15 blur-3xl"
            />

            <div className="container relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_420px] lg:gap-12 lg:px-8">
                {/* Left: course info */}
                <div className="min-w-0">
                    <Breadcrumb>
                        <BreadcrumbList className="text-xs font-medium">
                            <BreadcrumbItem>
                                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink render={<Link href="/courses" />}>Courses</BreadcrumbLink>
                            </BreadcrumbItem>
                            {category && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink render={<Link href={`/courses?category=${category.slug}`} />}>
                                            {category.name}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            )}
                            <BreadcrumbSeparator className="hidden sm:block" />
                            <BreadcrumbItem className="hidden sm:inline-flex">
                                <BreadcrumbPage className="max-w-56 truncate">{course.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Badges */}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        {badge && (
                            <Badge variant={badge.variant} className="h-auto px-2.5 py-0.5">
                                {badge.label}
                            </Badge>
                        )}
                        <Badge variant="outline" className="h-auto bg-background/80 px-2.5 py-0.5">
                            {getCourseLevelLabel(course.level)}
                        </Badge>
                        {/* every category of the course (the teacher can choose up to 3) → the courses of that category */}
                        {course.categories.map((item) => (
                            <Badge
                                key={item.id}
                                variant="outline"
                                className="h-auto bg-background/80 px-2.5 py-0.5 hover:border-primary/40 hover:text-primary"
                                render={<Link href={`/courses?category=${item.slug}`} />}
                            >
                                {item.name}
                            </Badge>
                        ))}
                    </div>

                    <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
                        {course.title}
                    </h1>

                    {course.short_description && (
                        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                            {course.short_description}
                        </p>
                    )}

                    {/* Rating + students */}
                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        {/* a link to the reviews section (id="reviews") */}
                        {course.rating_count > 0 ? (
                            <a href="#reviews" className="flex items-center gap-2 hover:underline">
                                <span className="font-bold text-amber-600 dark:text-amber-400">
                                    {course.rating_avg.toFixed(1)}
                                </span>
                                <RatingStars rating={course.rating_avg} />
                                <span className="text-muted-foreground">
                                    ({formatCompactNumber(course.rating_count)}{" "}
                                    {course.rating_count === 1 ? "rating" : "ratings"})
                                </span>
                            </a>
                        ) : (
                            <a href="#reviews" className="text-muted-foreground hover:underline">
                                No ratings yet
                            </a>
                        )}
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Users className="size-4" />
                            {formatCompactNumber(course.students_count)} students
                        </span>
                    </div>

                    {/* Instructor */}
                    <div className="mt-5 flex items-center gap-2.5">
                        <Avatar>
                            {course.instructor.avatar_url && (
                                <AvatarImage src={course.instructor.avatar_url} alt={instructorName} />
                            )}
                            <AvatarFallback>{instructorName[0]}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-muted-foreground">
                            Created by <span className="font-semibold text-foreground">{instructorName}</span>
                        </p>
                    </div>

                    {/* Course meta */}
                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-1.5">
                            <Clock className="size-4" /> {formatDuration(course.duration_seconds)} total
                        </li>
                        <li className="flex items-center gap-1.5">
                            <BookOpen className="size-4" /> {course.lessons_count} lessons
                        </li>
                        <li className="flex items-center gap-1.5">
                            <Globe className="size-4" /> {course.language}
                        </li>
                        <li className="flex items-center gap-1.5">
                            <CalendarClock className="size-4" /> Updated {lastUpdated}
                        </li>
                    </ul>
                </div>

                {/* Right: thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-xl ring-1 ring-foreground/10">
                    <CourseThumbnail
                        src={course.thumbnail_url}
                        alt={course.title}
                        sizes="(max-width: 1024px) 100vw, 420px"
                        priority
                        iconClassName="size-10"
                    />
                </div>
            </div>
        </section>
    );
}
