import Image from "next/image";
import { BarChart3, Sparkles, Plus } from "lucide-react";
import { HeroFloatingCard2Images, HeroFloatingCard4Images } from "@/features/home/data";

export function HeroVisual() {
  return (
    <div className="relative w-full max-w-lg lg:max-w-none mx-auto flex items-center justify-center pt-8 pb-12 lg:py-4">
      {/* Decorative Glow Background */}
      <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 via-purple-300/30 to-indigo-300/20 rounded-full blur-3xl -z-10 opacity-70" />

      {/* Main Student Image Container */}
      <div className="relative w-full max-w-105 aspect-4/5 rounded-[32px] overflow-hidden shadow-2xl border-4 border-card/80 bg-muted">
        <Image
          src="/images/hero-student.jpg"
          alt="EduWay student learning online"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover object-center"
        />
        {/* Soft bottom vignette */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Top Right Handwritten Annotation with Arrow */}
      <div className="hidden sm:block absolute -top-4 right-0 lg:-right-4 dark:text-primary-hover select-none pointer-events-none">
        <div className="flex flex-col items-center rotate-6">
          <span className="font-serif italic text-sm font-semibold tracking-wide text-primary">
            Skills today,
            <br />
            Opportunities tomorrow ✨
          </span>
          <svg
            className="w-12 h-10 text-primary -mt-1 ml-4"
            viewBox="0 0 60 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M10 5 C 25 15, 35 25, 45 35" />
            <path d="M35 35 L 45 35 L 45 25" />
          </svg>
        </div>
      </div>

      {/* Floating Card 1: 500+ Online Courses (Top Left) */}
      <div className="absolute -top-3 left-0 sm:-left-6 bg-card/95 backdrop-blur-md rounded-2xl shadow-xl border border-border/80 p-3 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-500">
        <div className="size-10 rounded-xl dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
          <BarChart3 className="size-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground leading-tight">500+</p>
          <p className="text-[11px] text-muted-foreground">Online Courses</p>
        </div>
      </div>

      {/* Floating Card 2: Top Instructors (Right Side) */}
      <div className="hidden sm:flex absolute top-1/4 -right-6 bg-card/95 backdrop-blur-md rounded-2xl shadow-xl border border-border/80 p-2.5 items-center gap-3 animate-in fade-in zoom-in-95 duration-700">
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
        <div>
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Learn from</p>
          <p className="text-xs font-bold text-foreground">Top Instructors</p>
        </div>
      </div>

      {/* Floating Card 3: Student Review (Bottom Left) */}
      <div className="absolute bottom-6 -left-2 sm:-left-12 bg-card/95 backdrop-blur-md rounded-2xl shadow-xl border border-border/80 p-3.5 max-w-60 sm:max-w-65 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex items-start gap-3">
          <Image
            src="/images/avatars/avatar-1.svg"
            alt="Ahmed Tarek"
            width={36}
            height={36}
            className="rounded-full shrink-0 ring-2 ring-primary/20"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug">
              &ldquo;EduWay helped me land my dream job!&rdquo;
            </p>
            <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-border/50">
              <div>
                <p className="text-[11px] font-bold text-foreground leading-none">Ahmed Tarek</p>
                <p className="text-[10px] text-muted-foreground">Frontend Developer</p>
              </div>
              <Sparkles className="size-3.5 text-primary shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card 4: 10K+ Active Students (Bottom Right) */}
      <div className="absolute -bottom-4 right-0 sm:-right-6 bg-card/95 backdrop-blur-md rounded-2xl shadow-xl border border-border/80 p-3.5 space-y-2 animate-in fade-in zoom-in-95 duration-1000">
        <div>
          <p className="text-base sm:text-lg font-extrabold text-foreground leading-none">10K+</p>
          <p className="text-[11px] text-muted-foreground">Active Students</p>
        </div>
        <div className="flex items-center -space-x-1.5 pt-0.5">
          {
            HeroFloatingCard4Images.map((image, idx) => (
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
          <div className="size-6 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground ring-2 ring-card">
            <Plus className="size-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
