import Image from "next/image";
import { RatingStars } from "../../../components/RatingStars";
import { Testimonial } from "../../../types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-200">
      {/* Quote */}
      <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed mb-6">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author and Rating Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative size-10 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/20 bg-muted">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-foreground truncate">
              {testimonial.name}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {testimonial.role}
            </p>
          </div>
        </div>

        {/* 5 Stars */}
        <div className="shrink-0">
          <RatingStars rating={testimonial.rating} />
        </div>
      </div>
    </div>
  );
}
