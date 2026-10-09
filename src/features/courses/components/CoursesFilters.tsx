"use client"
import { use } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { RatingStars } from "@/components/shared/RatingStars";
import { coursesFilterGroups, coursesRatingOptions } from "../data";
import { FilterGroup, FilterOption } from "../types";
import { useCoursesSearchParams } from "../hooks/useCoursesSearchParams";

type CoursesFiltersProps = {
  categoriesPromise: Promise<FilterOption[]>;
};

export function CoursesFilters({ categoriesPromise }: CoursesFiltersProps) {
  const { getValue, getValues, updateParams } = useCoursesSearchParams();

  // Categories come from the database, the other groups are static
  const categories = use(categoriesPromise);
  const filterGroups: FilterGroup[] = [
    { id: "category", title: "Category", options: categories },
    ...coursesFilterGroups,
  ];

  const handleFilterChange = (checked: boolean, value: string, queryName: string) => {
    // ?category=web-dev,design → ["web-dev", "design"]
    const selectedValues = getValues(queryName);

    let newValues: string[];

    if (checked) {
      // 1- checked => add the value (only if it's not already there)
      newValues = selectedValues.includes(value) ? selectedValues : [...selectedValues, value];
    } else {
      // 2- unchecked => remove the value
      newValues = selectedValues.filter((selected) => selected !== value);
    }

    // 3- write the values back to the URL: ["web-dev", "design"] => "web-dev,design"
    //    (an empty list → null → the param is removed)
    updateParams({ [queryName]: newValues.length > 0 ? newValues.join(",") : null });
  };

  // Remove every sidebar filter, but keep the search text and the sort
  const handleClearAll = () => {
    const changes: Record<string, null> = { rating: null };
    filterGroups.forEach((group) => (changes[group.id] = null));
    updateParams(changes);
  };

  return (
    <aside className="space-y-5" aria-label="Course filters">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Filters</h2>
        <Button variant="link" size="sm" className="h-auto p-0" onClick={handleClearAll}>
          Clear all
        </Button>
      </div>

      {filterGroups.map((group) => (
        <fieldset key={group.id} className="space-y-3">
          <Separator className="mb-5" />
          <legend className="sr-only">{group.title}</legend>
          <p className="text-sm font-semibold text-foreground">{group.title}</p>

          {group.options.map((option) => {
            const id = `filter-${group.id}-${option.id}`;
            return (
              <div key={option.id} className="flex items-center justify-between gap-3">
                <Label htmlFor={id} className="cursor-pointer font-normal text-muted-foreground hover:text-foreground">
                  <Checkbox
                    id={id}
                    name={group.id}
                    value={option.id}
                    // checked comes from the URL => stays correct after refresh / back button
                    checked={getValues(group.id).includes(option.id)}
                    onCheckedChange={(checked) => handleFilterChange(checked, option.id, group.id)}
                  />
                  {option.label}
                </Label>
                {option.count !== undefined && (
                  <span className="text-xs tabular-nums text-muted-foreground/70">{option.count}</span>
                )}
              </div>
            );
          })}
        </fieldset>
      ))}

      {/* Rating: one value only (radio), not a list */}
      <fieldset className="space-y-3">
        <Separator className="mb-5" />
        <legend className="sr-only">Rating</legend>
        <p className="text-sm font-semibold text-foreground">Rating</p>

        <RadioGroup
          value={getValue("rating") ?? ""}
          onValueChange={(value) => updateParams({ rating: value as string })}
          className="gap-3"
        >
          {coursesRatingOptions.map((rating) => {
            const id = `filter-rating-${rating}`;
            return (
              <Label key={rating} htmlFor={id} className="cursor-pointer font-normal text-muted-foreground hover:text-foreground">
                <RadioGroupItem id={id} value={String(rating)} />
                <RatingStars rating={rating} />
                <span>{rating} & up</span>
              </Label>
            );
          })}
        </RadioGroup>
      </fieldset>
    </aside>
  );
}
