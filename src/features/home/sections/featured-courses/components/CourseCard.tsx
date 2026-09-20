"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "../../../components/RatingStars";
import { Course } from "../../../types";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40">
      {/* Thumbnail Area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Floating Top Left Badge */}
        {course.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge
              variant={course.badge.variant}
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm"
            >
              {course.badge.label}
            </Badge>
          </div>
        )}

        {/* Floating Bottom Right Duration Pill */}
        <div className="absolute bottom-2 right-2 z-10">
          <span className="bg-black/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
            {course.duration}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Title */}
          <Link href={`/courses/${course.slug}`}>
            <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {course.title}
            </h3>
          </Link>

          {/* Instructor Row */}
          <div className="flex items-center gap-2">
            <div className="relative size-5 rounded-full overflow-hidden shrink-0 ring-1 ring-border">
              <Image
                src={course.instructor.avatar}
                alt={course.instructor.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium truncate">
              {course.instructor.name}
            </span>
          </div>

          {/* Rating */}
          <RatingStars
            rating={course.rating}
            showNumeric
            countLabel={course.studentsCount}
          />
        </div>

        {/* Footer: Price & Bookmark */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60 mt-auto">
          <span className="text-base font-extrabold text-foreground">
            ${course.price.toFixed(2)}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsBookmarked(!isBookmarked);
            }}
            aria-label={isBookmarked ? "Remove from wishlist" : "Add to wishlist"}
            className="p-1 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
          >
            <Bookmark
              className={`size-4 transition-colors ${isBookmarked ? "fill-primary text-primary" : "text-muted-foreground"
                }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
