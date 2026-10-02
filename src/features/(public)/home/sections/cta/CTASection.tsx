import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-10 sm:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-primary via-[#6a2de6] to-primary p-8 sm:p-12 lg:p-14 text-white shadow-2xl">
          {/* Decorative Background Swirls */}
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
            <svg
              className="absolute -left-10 -bottom-10 w-96 h-96 text-white"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              <path d="M42.7,-62.9C53.8,-52.9,60.2,-38.7,66.1,-24.1C72,-9.5,77.4,5.6,73.7,18.8C70,32.1,57.2,43.6,43.6,53.2C30,62.8,15,70.5,-0.6,71.3C-16.1,72.1,-32.2,66,-45.5,56C-58.8,46,-69.3,32.1,-73.4,16.4C-77.5,0.7,-75.2,-16.9,-67.2,-30.8C-59.2,-44.7,-45.5,-55,-31.6,-63.9C-17.7,-72.8,-3.8,-80.4,8.5,-72.7C20.8,-65,31.6,-72.9,42.7,-62.9Z" transform="translate(100 100)" />
            </svg>
            <svg
              className="absolute -right-10 -top-10 w-96 h-96 text-white"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              <path d="M47.7,-64.4C60.9,-55.9,70.1,-41.5,75.4,-25.6C80.7,-9.7,82.1,7.8,76.5,23.3C70.9,38.8,58.3,52.3,43.5,61.9C28.7,71.5,11.7,77.2,-4.7,73.7C-21.1,70.2,-36.9,57.5,-49.2,43.7C-61.5,29.9,-70.3,15,-72.4,-1.2C-74.5,-17.4,-69.9,-34.8,-59.1,-46.4C-48.3,-58,-31.3,-63.8,-15.5,-68.8C0.3,-73.8,16.5,-78,34.5,-72.9C40.5,-71.2,41.2,-68.1,47.7,-64.4Z" transform="translate(100 100)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            {/* Left Content */}
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                READY TO TAKE THE NEXT STEP?
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Start Learning Today
              </h2>
              <p className="text-sm sm:text-base text-white/90">
                Join thousands of learners and gain the skills that matter.
              </p>
            </div>

            {/* Right Action Button */}
            <div className="shrink-0">
              <Link href="/signup">
                <Button
                  className="rounded-full bg-white text-primary hover:bg-white/90 font-bold px-8 py-3.5 h-auto text-sm sm:text-base shadow-xl hover:scale-105 transition-all"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
