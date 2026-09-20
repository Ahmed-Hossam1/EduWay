import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  showNumeric?: boolean;
  countLabel?: string;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  showNumeric = false,
  countLabel,
  className = "",
}: RatingStarsProps) {
  if (showNumeric) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs md:text-sm ${className}`}>
        <Star className="size-4 fill-amber-400 text-amber-400 shrink-0" />
        <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
        {countLabel && (
          <span className="text-muted-foreground">({countLabel})</span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}
