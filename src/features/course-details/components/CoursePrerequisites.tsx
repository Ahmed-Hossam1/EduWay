import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseThumbnail } from "@/features/courses/components/CourseThumbnail";
import { PrerequisiteCourse } from "../types";

type CoursePrerequisitesProps = {
    prerequisites: PrerequisiteCourse[];
};

/**
 * "Finish these courses first" — other EduWay courses (course_requirements table), each one is a link.
 * Not the same as "Requirements": those are free text the teacher writes ("Basic HTML").
 */
export function CoursePrerequisites({ prerequisites }: CoursePrerequisitesProps) {
    if (prerequisites.length === 0) return null;

    return (
        <section aria-labelledby="prerequisites-title">
            <h2 id="prerequisites-title" className="text-2xl font-bold tracking-tight text-foreground">
                Take these courses first
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">This course builds on what they teach.</p>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {prerequisites.map((prerequisite) => (
                    <li key={prerequisite.id}>
                        <Link
                            href={`/courses/${prerequisite.slug}`}
                            className="group flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
                        >
                            <div className="relative aspect-16/10 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                                <CourseThumbnail
                                    src={prerequisite.thumbnail_url}
                                    alt={prerequisite.title}
                                    sizes="80px"
                                    iconClassName="size-4"
                                />
                            </div>
                            <span className="line-clamp-2 flex-1 text-sm font-semibold text-foreground group-hover:text-primary">
                                {prerequisite.title}
                            </span>
                            <ArrowRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
