import Link from "next/link";
import {
  Code2,
  BarChart3,
  Palette,
  Briefcase,
  Megaphone,
  Monitor,
  Sprout,
  Heart,
  ArrowRight,
} from "lucide-react";
import { LearningPath } from "../../../types";

interface LearningPathCardProps {
  path: LearningPath;
}

const iconComponentMap = {
  code: Code2,
  "bar-chart": BarChart3,
  palette: Palette,
  briefcase: Briefcase,
  megaphone: Megaphone,
  monitor: Monitor,
  sprout: Sprout,
  heart: Heart,
};

const colorStyles = {
  purple: {
    iconBg: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    buttonBg: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white dark:bg-purple-950/60 dark:text-purple-300",
  },
  blue: {
    iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    buttonBg: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/60 dark:text-blue-300",
  },
  orange: {
    iconBg: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
    buttonBg: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white dark:bg-orange-950/60 dark:text-orange-300",
  },
  green: {
    iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    buttonBg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  teal: {
    iconBg: "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
    buttonBg: "bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white dark:bg-teal-950/60 dark:text-teal-300",
  },
  pink: {
    iconBg: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
    buttonBg: "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white dark:bg-rose-950/60 dark:text-rose-300",
  },
};

export function LearningPathCard({ path }: LearningPathCardProps) {
  const IconComponent = iconComponentMap[path.iconName];
  const styles = colorStyles[path.colorScheme];

  return (
    <Link
      href={`/courses?category=${path.id}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40"
    >
      <div>
        {/* Category Icon */}
        <div
          className={`size-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${styles.iconBg}`}
        >
          <IconComponent className="size-6" />
        </div>

        {/* Title and Subtitle */}
        <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
          {path.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-1">
          {path.subtitle}
        </p>
      </div>

      {/* Course Count and Arrow Action */}
      <div className="flex items-center justify-between pt-6 mt-2 border-t border-border/40">
        <span className="text-xs font-semibold text-muted-foreground">
          {path.courseCount}
        </span>
        <div
          className={`size-8 rounded-full flex items-center justify-center transition-all ${styles.buttonBg}`}
        >
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
