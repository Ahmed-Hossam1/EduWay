"use client"
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/RatingStars";
import { coursesFilterGroups, coursesRatingOptions } from "../data";
import { useState } from "react";

export function CoursesFilters() {

  const [filters, setFilters] = useState({
    category: "",
    level: "",
    sort: "",
    page: "1",
  })

  // const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [e.target.name]: e.target.value,
  //   }))
  // }

  return (
    <aside className="space-y-6" aria-label="Course filters">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Filters</h2>
        <Button variant="link" size="sm" className="h-auto p-0">
          Clear all
        </Button>
      </div>

      {coursesFilterGroups.map((group) => (
        <fieldset key={group.id} className="space-y-3 border-t border-border pt-5">
          <legend className="sr-only">{group.title}</legend>
          <p className="text-sm font-semibold text-foreground">{group.title}</p>
          {group.options.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center justify-between gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex items-center gap-2.5">
                <Checkbox name={group.id} value={option.id} />
                {option.label}
              </span>
              {option.count !== undefined && (
                <span className="text-xs tabular-nums text-muted-foreground/70">{option.count}</span>
              )}
            </label>
          ))}
        </fieldset>
      ))}

      {/* Rating */}
      <fieldset className="space-y-3 border-t border-border pt-5">
        <legend className="sr-only">Rating</legend>
        <p className="text-sm font-semibold text-foreground">Rating</p>
        {coursesRatingOptions.map((rating) => (
          <label
            key={rating}
            className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <input type="radio" name="rating" value={rating} className="size-4 accent-primary" />
            <RatingStars rating={rating} />
            <span>{rating} & up</span>
          </label>
        ))}
      </fieldset>
    </aside>
  );
}
