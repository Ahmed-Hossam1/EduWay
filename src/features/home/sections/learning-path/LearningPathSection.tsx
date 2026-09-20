import { SectionHeading } from "../../components/SectionHeading";
import { LearningPathCard } from "./components/LearningPathCard";
import { learningPaths } from "../../data";

export function LearningPathSection() {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Choose Your Learning Path"
          subtitle="Explore our most in-demand fields and start learning the skills that shape tomorrow."
          actionText="View All Categories"
          actionHref="/categories"
        />

        {/* 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {learningPaths.map((path) => (
            <LearningPathCard key={path.id} path={path} />
          ))}
        </div>
      </div>
    </section>
  );
}
