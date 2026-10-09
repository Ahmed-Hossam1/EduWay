import { use } from "react";
import { CoursesResponse } from "../types";

type CoursesCountProps = {
  coursesPromise: Promise<CoursesResponse>;
};

// "Showing 3 courses" — uses the same promise as CoursesGrid (no extra database call)
export function CoursesCount({ coursesPromise }: CoursesCountProps) {
  const { totalCount } = use(coursesPromise);

  return (
    <p className="text-sm text-muted-foreground">
      Showing <span className="font-semibold text-foreground">{totalCount}</span> courses
    </p>
  );
}
