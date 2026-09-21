
import { Footer } from "@/components/shared/Footer";
import { TrustedCompaniesSection } from "./sections/trusted-companies/TrustedCompaniesSection";
import { Navbar } from "@/components/shared/Navbar";
import { HeroSection } from "./sections/hero/HeroSection";
import { LearningPathSection } from "./sections/learning-path/LearningPathSection";
import { FeaturedCoursesSection } from "./sections/featured-courses/FeaturedCoursesSection";
import { CareerBannerSection } from "./sections/career-banner/CareerBannerSection";
import { StatisticsSection } from "./sections/statistics";
import { TestimonialsSection } from "./sections/testimonials/TestimonialsSection";
import { CTASection } from "./sections/cta/CTASection";

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrustedCompaniesSection />
        <LearningPathSection />
        <FeaturedCoursesSection />
        <CareerBannerSection />
        <StatisticsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
