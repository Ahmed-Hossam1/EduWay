"use client"
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/RatingStars";
import { coursesFilterGroups, coursesRatingOptions } from "../data";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import { FilterGroup, FilterOption } from "../types";

type CoursesFiltersProps = {
  categoriesPromise: Promise<FilterOption[]>;
};

export function CoursesFilters({ categoriesPromise }: CoursesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Categories come from the database, the other groups are static
  const categories = use(categoriesPromise);
  const filterGroups: FilterGroup[] = [
    { id: "category", title: "Category", options: categories },
    ...coursesFilterGroups,
  ];
  // using this to update URL params instead of using searchParams because searchParams is readonly
  const params = new URLSearchParams(searchParams.toString());

  // Values of one group from the URL
  // ?category=web-dev,design => getSelectedValues("category") => ["web-dev", "design"]
  const getSelectedValues = (groupName: string) => {
    return searchParams.get(groupName)?.split(",") ?? [];
  };

  // Put the new params in the URL => the page gets the new courses from the server
  const updateUrl = (params: URLSearchParams) => {
    params.delete("page"); // filters changed => start again from page 1
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (checked: boolean, value: string, groupName: string) => {
    // copy the current URL params so we keep the other filters (search, sort, ...)
    const selectedValues = getSelectedValues(groupName);

    let newValues: string[];

    if (checked) {
      // 1- checked => add the value (only if it's not already there)
      newValues = selectedValues.includes(value) ? selectedValues : [...selectedValues, value];
    } else {
      // 2- unchecked => remove the value
      newValues = selectedValues.filter((selected) => selected !== value);
    }

    // 3- write the values back to the URL: ["web-dev", "design"] => "web-dev,design"
    //    or remove the param when nothing is selected in this group
    if (newValues.length > 0) {
      params.set(groupName, newValues.join(","));
    } else {
      params.delete(groupName);
    }

    updateUrl(params);
  };

  // Rating is one value only (radio), not a list
  const handleRatingChange = (rating: number) => {
    params.set("rating", String(rating));
    updateUrl(params);
  };

  // Remove every sidebar filter, but keep the search text and the sort
  const handleClearAll = () => {
    filterGroups.forEach((group) => params.delete(group.id));
    params.delete("rating");
    updateUrl(params);
  };

  return (
    <aside className="space-y-6" aria-label="Course filters">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Filters</h2>
        <Button variant="link" size="sm" className="h-auto p-0" onClick={handleClearAll}>
          Clear all
        </Button>
      </div>

      {filterGroups.map((group) => (
        <fieldset key={group.id} className="space-y-3 border-t border-border pt-5">
          <legend className="sr-only">{group.title}</legend>
          <p className="text-sm font-semibold text-foreground">{group.title}</p>
          {group.options.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center justify-between gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex items-center gap-2.5">
                <Checkbox
                  name={group.id}
                  value={option.id}
                  // checked comes from the URL => stays correct after refresh / back button
                  checked={getSelectedValues(group.id).includes(option.id)}
                  onCheckedChange={(checked) => handleFilterChange(checked, option.id, group.id)}
                />
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
            <input
              type="radio"
              name="rating"
              value={rating}
              checked={searchParams.get("rating") === String(rating)}
              onChange={() => handleRatingChange(rating)}
              className="size-4 accent-primary"
            />
            <RatingStars rating={rating} />
            <span>{rating} & up</span>
          </label>
        ))}
      </fieldset>
    </aside>
  );
}
