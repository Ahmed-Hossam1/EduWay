import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getInstructorName } from "@/features/courses/utils/format";
import { CourseDetailsInstructor } from "../types";

type CourseInstructorProps = {
    instructor: CourseDetailsInstructor;
};

// Name + photo from profiles, headline + short bio from instructor_profiles
export function CourseInstructor({ instructor }: CourseInstructorProps) {
    const name = getInstructorName(instructor);
    const profile = instructor.profile;

    return (
        <section aria-labelledby="instructor-title">
            <h2 id="instructor-title" className="text-2xl font-bold tracking-tight text-foreground">
                Instructor
            </h2>
            <Card className="mt-4 gap-4 rounded-2xl p-5">
                <div className="flex items-center gap-4">
                    <Avatar className="size-16">
                        {instructor.avatar_url && <AvatarImage src={instructor.avatar_url} alt={name} />}
                        <AvatarFallback className="text-lg">{name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <Link
                            href={`/instructors/${instructor.id}`}
                            className="text-base font-semibold text-foreground transition-colors hover:text-primary"
                        >
                            {name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{profile?.headline ?? "EduWay Instructor"}</p>
                    </div>
                </div>

                {/* line-clamp-4 → only the start of the bio, the full one is on his page */}
                {profile?.bio && (
                    <p className="line-clamp-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                        {profile.bio}
                    </p>
                )}

                <Button variant="outline" rounded="full" className="w-fit" asChild>
                    <Link href={`/instructors/${instructor.id}`}>
                        View profile
                        <ArrowRight />
                    </Link>
                </Button>
            </Card>
        </section>
    );
}
