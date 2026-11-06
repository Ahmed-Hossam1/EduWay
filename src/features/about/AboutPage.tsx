import { CTASection } from "@/features/home/sections/cta/CTASection";
import { AboutHero } from "./components/AboutHero";
import { AboutValues } from "./components/AboutValues";
import { AboutFeatures } from "./components/AboutFeatures";
import { AboutHowItWorks } from "./components/AboutHowItWorks";

// Navbar + Footer come from app/(public)/layout.tsx
// The real numbers (Stats) come in the next step, between the Hero and the Mission
export function AboutPage() {
    return (
        <div className="bg-background text-foreground">
            <AboutHero />
            <AboutValues />
            <AboutFeatures />
            <AboutHowItWorks />
            <CTASection />
        </div>
    );
}
