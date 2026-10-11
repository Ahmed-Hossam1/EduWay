import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

type CourseLearningOutcomesProps = {
  outcomes: string[];
};

// "What you'll learn" — courses.learning_outcomes
export function CourseLearningOutcomes({ outcomes }: CourseLearningOutcomesProps) {
  if (outcomes.length === 0) return null;

  return (
    <Card className="gap-4 rounded-2xl p-6" aria-labelledby="outcomes-title">
      <h2 id="outcomes-title" className="text-xl font-bold tracking-tight text-foreground">
        What you&apos;ll learn
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {outcomes.map((outcome) => (
          <li key={outcome} className="flex items-start gap-2.5 text-sm text-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            {outcome}
          </li>
        ))}
      </ul>
    </Card>
  );
}
