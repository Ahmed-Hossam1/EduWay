import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coursesCategoryChips, coursesSortOptions } from "../data";

interface CoursesToolbarProps {
  resultsCount: number;
}

export function CoursesToolbar({ resultsCount }: CoursesToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Category chips */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {coursesCategoryChips.map((chip, index) => (
          <button
            key={chip}
            type="button"
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${index === 0
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Results count + sort */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{resultsCount}</span> courses
        </p>

        <div className="flex items-center gap-2">
          {/* Mobile only: the filters sidebar is hidden on small screens */}
          <Button variant="outline" size="sm" className="rounded-full lg:hidden">
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Sort by</span>
            <select
              name="sort"
              defaultValue={coursesSortOptions[0].value}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {coursesSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
