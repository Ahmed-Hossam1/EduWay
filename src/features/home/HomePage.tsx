import { Navbar } from "./sections/navbar";
import { HeroSection } from "./sections/hero";
import { TrustedCompaniesSection } from "./sections/trusted-companies";
import { LearningPathSection } from "./sections/learning-path";
import { FeaturedCoursesSection } from "./sections/featured-courses";
import { CareerBannerSection } from "./sections/career-banner";
import { StatisticsSection } from "./sections/statistics";
import { TestimonialsSection } from "./sections/testimonials";
import { CTASection } from "./sections/cta";
import { Footer } from "./sections/footer";

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
