import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroFloatingCard2Images } from "../../data";

export function CareerBannerSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] overflow-hidden bg-linear-to-br from-[#120d29] via-[#1a113a] to-[#110c26] text-white p-8 sm:p-12 lg:p-16 border border-primary/20 shadow-2xl">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-1/4 size-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 size-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
                  YOUR SKILLS, A BRIGHTER TOMORROW.
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                  Invest in Yourself,
                  <br />
                  Unlock New Opportunities
                </h2>
                <p className="text-sm sm:text-base text-gray-300 max-w-lg leading-relaxed pt-1">
                  Get unlimited access to 500+ courses, hands-on projects, and
                  professional certificates.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/signup">
                  <Button
                    className="rounded-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8 py-3 h-auto text-sm shadow-lg shadow-primary/30"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="size-4 ml-1.5" />
                  </Button>
                </Link>

                <Link href="/preview">
                  <Button
                    variant="outline"
                    className="rounded-full border-white/25 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3 h-auto text-sm backdrop-blur-xs"
                  >
                    <Play className="size-4 mr-2 fill-white" />
                    <span>Watch Video</span>
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  {
                    HeroFloatingCard2Images.map((image, idx) => (
                      <Image
                        key={idx}
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        className={image.className}
                      />
                    ))
                  }
                </div>
                <p className="text-xs text-gray-300 font-medium">
                  Join <span className="text-white font-bold">10,000+</span> learners
                  already building their future with EduWay.
                </p>
              </div>
            </div>

            {/* Right Visual */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Central Glowing Circle Background */}
              <div className="relative size-64 sm:size-72 lg:size-80 rounded-full bg-linear-to-tr from-primary/40 to-purple-400/20 p-2 shadow-2xl">
                <div className="relative size-full rounded-full overflow-hidden border-2 border-white/20">
                  <Image
                    src="/images/career-woman.jpg"
                    alt="Empowered learner"
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover object-center"
                  />
                </div>
              </div>

              {/* Floating Large Play Button */}
              <div className="absolute top-1/2 -left-3 sm:left-4 -translate-y-1/2 size-12 sm:size-14 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/50 cursor-pointer hover:scale-105 transition-transform">
                <Play className="size-5 sm:size-6 fill-white ml-0.5" />
              </div>

              {/* Floating Pill: Learn Anywhere */}
              <div className="absolute top-2 left-4 sm:left-8 bg-white text-gray-900 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer">
                <span>Learn Anywhere</span>
                <ArrowRight className="size-3.5 text-primary" />
              </div>

              {/* Floating Card: Track Your Progress */}
              <div className="absolute -bottom-2 right-2 sm:right-6 bg-white text-gray-900 rounded-2xl p-2.5 sm:p-3 shadow-xl flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <TrendingUp className="size-4" />
                </div>
                <div>
                  <p className="text-5 font-bold leading-tight">Track</p>
                  <p className="text-5 text-gray-500 font-medium">Your Progress</p>
                </div>
              </div>

              {/* Handwritten Note with Arrow (Top Right) */}
              <div className="hidden sm:block absolute -top-4 right-0 text-white/90 select-none pointer-events-none">
                <div className="flex flex-col items-center rotate-6">
                  <span className="font-serif italic text-xs sm:text-sm font-bold tracking-wide text-purple-200">
                    Same Learner,
                    <br />
                    Bigger Dreams ✨
                  </span>
                  <svg
                    className="w-10 h-8 text-purple-200 -mt-1 ml-4"
                    viewBox="0 0 50 35"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="M5 5 C 20 12, 28 20, 38 28" />
                    <path d="M28 28 L 38 28 L 38 20" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
