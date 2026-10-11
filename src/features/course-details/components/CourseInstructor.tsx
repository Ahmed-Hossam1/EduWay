import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { CourseInstructor as CourseInstructorType } from "@/features/courses/types";
import { getInstructorName } from "@/features/courses/utils/format";

type CourseInstructorProps = {
  instructor: CourseInstructorType;
};

// Only name + photo for now — bio / headline come with the instructor_profiles table
export function CourseInstructor({ instructor }: CourseInstructorProps) {
  const name = getInstructorName(instructor);

  return (
    <section aria-labelledby="instructor-title">
      <h2 id="instructor-title" className="text-2xl font-bold tracking-tight text-foreground">
        Instructor
      </h2>
      <Card className="mt-4 flex-row items-center gap-4 rounded-2xl p-5">
        <Avatar className="size-16">
          {instructor.avatar_url && <AvatarImage src={instructor.avatar_url} alt={name} />}
          <AvatarFallback className="text-lg">{name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">EduWay Instructor</p>
        </div>
      </Card>
    </section>
  );
}
