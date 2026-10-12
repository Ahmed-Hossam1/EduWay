import Link from "next/link";
import { BookOpen, Star, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCompactNumber, getInstructorName } from "@/features/courses/utils/format";
import { InstructorListItem } from "../types";

// how many skills we show on the card, the rest becomes "+2"
const MAX_SKILLS = 3;

type InstructorCardProps = {
  instructor: InstructorListItem;
};

export function InstructorCard({ instructor }: InstructorCardProps) {
  const name = getInstructorName(instructor);
  const { stats } = instructor;

  const shownSkills = instructor.skills.slice(0, MAX_SKILLS);
  const hiddenSkillsCount = instructor.skills.length - shownSkills.length;

  const items = [
    { icon: BookOpen, value: String(stats.coursesCount), label: "Courses" },
    { icon: Users, value: formatCompactNumber(stats.studentsCount), label: "Students" },
    { icon: Star, value: stats.ratingsCount > 0 ? stats.averageRating.toFixed(1) : "—", label: "Rating" },
  ];

  return (
    <Card className="group relative text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/40">
      <CardContent className="flex flex-col items-center">
        <Avatar className="size-20 ring-4 ring-accent">
          {instructor.avatar_url && <AvatarImage src={instructor.avatar_url} alt={name} />}
          <AvatarFallback className="text-2xl">{name[0]}</AvatarFallback>
        </Avatar>

        {/* The link covers the whole card (after:inset-0) => click anywhere to open */}
        <Link
          href={`/instructors/${instructor.id}`}
          className="mt-4 text-lg font-bold text-foreground transition-colors group-hover:text-primary after:absolute after:inset-0"
        >
          {name}
        </Link>

        <p className="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground">
          {instructor.headline ?? "EduWay Instructor"}
        </p>

        {/* Skills */}
        {shownSkills.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {shownSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="h-auto px-2.5 py-0.5">
                {skill}
              </Badge>
            ))}
            {hiddenSkillsCount > 0 && (
              <Badge variant="outline" className="h-auto px-2.5 py-0.5">
                +{hiddenSkillsCount}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {/* Stats: courses / students / rating */}
      <CardFooter className="grid grid-cols-3 divide-x divide-border">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-0.5">
            <span className="flex items-center gap-1 text-base font-black text-foreground">
              <item.icon className="size-4 text-primary" />
              {item.value}
            </span>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
