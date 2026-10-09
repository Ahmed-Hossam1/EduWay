import Image from "next/image";
import Link from "next/link";
import { Bookmark, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RatingStars } from "@/components/shared/RatingStars";
import { Button } from "@/components/ui/button";
import { Course } from "../types";
import {
  COURSE_BADGES,
  formatCompactNumber,
  formatDuration,
  formatPrice,
  getInstructorName,
} from "../utils/format";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const badge = course.badge ? COURSE_BADGES[course.badge] : null;
  const instructorName = getInstructorName(course.instructor);

  return (
    <Card className="group relative transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/40">
      {/* Thumbnail — first child gets rounded-t-xl from Card automatically */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-8" />
          </div>
        )}

        {/* Floating badge */}
        {badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge
              variant={badge.variant}
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm"
            >
              {badge.label}
            </Badge>
          </div>
        )}

        {/* Duration pill */}
        {course.duration_seconds > 0 && (
          <div className="absolute bottom-2 right-2 z-10">
            <span className="bg-black/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
              {formatDuration(course.duration_seconds)}
            </span>
          </div>
        )}
      </div>

      {/* Header: Title + Bookmark */}
      <CardHeader>
        <CardTitle>
          <Link href={`/courses/${course.slug}`}>
            <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {course.title}
            </span>
          </Link>
        </CardTitle>

        <CardAction>
          <Button variant={"ghost"} size={"icon"} aria-label="Save course">
            <Bookmark />
          </Button>
        </CardAction>
      </CardHeader>

      {/* Content: Instructor + Rating */}
      <CardContent className="flex flex-col gap-2">
        {/* Instructor */}
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            {course.instructor.avatar_url && (
              <AvatarImage src={course.instructor.avatar_url} alt={instructorName} />
            )}
            <AvatarFallback>{instructorName[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground font-medium truncate">
            {instructorName}
          </span>
        </div>

        {/* Rating */}
        <RatingStars
          rating={course.rating_avg}
          showNumeric
          countLabel={`${formatCompactNumber(course.students_count)} students`}
        />
      </CardContent>

      {/* Footer: Price */}
      <CardFooter className="justify-between">
        <span className="text-base font-extrabold text-foreground">
          {formatPrice(course.price, course.currency)}
        </span>
      </CardFooter>
    </Card>
  );
}
