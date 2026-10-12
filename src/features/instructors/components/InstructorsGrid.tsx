import { use } from "react";
import { SearchX } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { InstructorListItem } from "../types";
import { InstructorCard } from "./InstructorCard";

type InstructorsGridProps = {
  instructorsPromise: Promise<InstructorListItem[]>;
};

// Shows the instructor cards.
// It receives the promise (not the data) → use() waits for it,
// and <Suspense> shows <InstructorsGridSkeleton /> until the data is ready.
export function InstructorsGrid({ instructorsPromise }: InstructorsGridProps) {
  const instructors = use(instructorsPromise);

  if (instructors.length === 0) {
    return (
      <Empty className="border border-dashed py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>No instructors found</EmptyTitle>
          <EmptyDescription>Try another name.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {instructors.map((instructor) => (
        <InstructorCard key={instructor.id} instructor={instructor} />
      ))}
    </div>
  );
}
