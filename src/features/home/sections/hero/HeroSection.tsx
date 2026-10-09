import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HeroSearch } from "./components/HeroSearch";
import { HeroBenefits } from "./components/HeroBenefits";
import { HeroVisual } from "./components/HeroVisual";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy, Search, and Benefits */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Promotional Pill Badge */}
            <div>
              <Badge
                variant="accent"
                className="rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 border border-primary/20 shadow-xs"
              >
                <Sparkles className="size-3.5 text-primary" />
                <span>Unlock a Brighter Future</span>
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-foreground leading-[1.12]">
              Learn Skills
              <br />
              That Actually
              <br />
              <span className="text-primary">Move You Forward</span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Join thousands of learners, take expert-led courses, and gain
              real-world skills to build the future you want.
            </p>

            {/* Search Bar + Chips */}
            <HeroSearch />

            {/* 4 Key Benefits */}
            <HeroBenefits />
          </div>

          {/* Right Column: Hero Visual Graphic */}
          <div className="lg:col-span-5">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
