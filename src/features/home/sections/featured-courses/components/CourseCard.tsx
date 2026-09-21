"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { RatingStars } from "../../../components/RatingStars";
import { Course } from "../../../types";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {

  return (
    <Card className="group relative transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/40">
      {/* Thumbnail — first child gets rounded-t-xl from Card automatically */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Floating badge */}
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

        {/* Duration pill */}
        <div className="absolute bottom-2 right-2 z-10">
          <span className="bg-black/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
            {course.duration}
          </span>
        </div>
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
          <Button variant={"ghost"} size={"icon"}>
            <Bookmark />
          </Button>
        </CardAction>
      </CardHeader>

      {/* Content: Instructor + Rating */}
      <CardContent className="flex flex-col gap-2">
        {/* Instructor */}
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
      </CardContent>

      {/* Footer: Price */}
      <CardFooter className="justify-between">
        <span className="text-base font-extrabold text-foreground">
          ${course.price.toFixed(2)}
        </span>
      </CardFooter>
    </Card>
  );
}
