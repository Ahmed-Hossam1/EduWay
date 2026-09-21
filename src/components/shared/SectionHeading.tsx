import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  actionText,
  actionHref,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 md:mb-10 ${className}`}>
      <div className="max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-base text-muted-foreground mt-1.5">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors group self-start sm:self-auto shrink-0"
        >
          <span>{actionText}</span>
          <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}
