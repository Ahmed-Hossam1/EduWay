import { SectionHeading } from "@/components/shared/SectionHeading";
import { CategoryPlanets } from "./components/CategoryPlanets";

// The home page "Explore categories" section: the title + the planets (3D on big screens, cards on small ones)
export function CategoryPlanetsSection() {
    return (
        <section className="py-14 sm:py-20 lg:py-24">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title="A Universe of Skills"
                    subtitle="Every planet is a field you can learn. Pick one and see where it can take you."
                    actionText="View All Categories"
                    actionHref="/categories"
                />

                <CategoryPlanets />
            </div>
        </section>
    );
}
