import { TrustedCompaniesSection } from "./sections/trusted-companies/TrustedCompaniesSection";
import { HeroSection } from "./sections/hero/HeroSection";
import { LearningPathSection } from "./sections/learning-path/LearningPathSection";
import { FeaturedCoursesSection } from "./sections/featured-courses/FeaturedCoursesSection";
import { CareerBannerSection } from "./sections/career-banner/CareerBannerSection";
import { StatisticsSection } from "./sections/statistics/StatisticsSection";
import { TestimonialsSection } from "./sections/testimonials/TestimonialsSection";
import { CTASection } from "./sections/cta/CTASection";
import { CourseCard } from "@/features/courses/types";

type HomePageProps = {
    featuredCoursesPromise: Promise<CourseCard[]>; // started in app/(public)/page.tsx (no await → streamed)
};

// Navbar + Footer come from app/(public)/layout.tsx
export function HomePage({ featuredCoursesPromise }: HomePageProps) {
    return (
        <div className="bg-background text-foreground selection:bg-primary/20 selection:text-primary">
            <HeroSection />
            <TrustedCompaniesSection />
            <LearningPathSection />
            <FeaturedCoursesSection coursesPromise={featuredCoursesPromise} />
            <CareerBannerSection />
            <StatisticsSection />
            <TestimonialsSection />
            <CTASection />
        </div>
    );
}
