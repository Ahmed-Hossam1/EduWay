import { use } from "react";
import { InstructorListItem } from "../types";

type InstructorsCountProps = {
  instructorsPromise: Promise<InstructorListItem[]>;
};

// "Showing 3 instructors" — uses the same promise as InstructorsGrid (no extra database call)
export function InstructorsCount({ instructorsPromise }: InstructorsCountProps) {
  const instructors = use(instructorsPromise);

  return (
    <p className="text-sm text-muted-foreground">
      Showing <span className="font-semibold text-foreground">{instructors.length}</span>{" "}
      {instructors.length === 1 ? "instructor" : "instructors"}
    </p>
  );
}
