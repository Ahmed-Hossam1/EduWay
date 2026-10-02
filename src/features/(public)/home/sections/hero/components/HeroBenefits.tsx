import { Award, Play, CheckCircle2, Users } from "lucide-react";
import { heroBenefits } from "../../../data";

const iconMap = {
  award: Award,
  play: Play,
  "check-circle": CheckCircle2,
  users: Users,
};

export function HeroBenefits() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-border/60">
      {heroBenefits.map((benefit) => {
        const IconComponent = iconMap[benefit.icon];
        return (
          <div key={benefit.label} className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-105 transition-transform">
              <IconComponent className="size-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground leading-tight">
              {benefit.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
