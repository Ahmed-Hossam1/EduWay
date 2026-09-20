import { Users, BookOpen, Award, Star } from "lucide-react";
import { statistics } from "../../data";

const statIconMap = {
  users: Users,
  "book-open": BookOpen,
  award: Award,
  star: Star,
};

export function StatisticsSection() {
  return (
    <section className="py-10 sm:py-14 border-y border-border/60 bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {statistics.map((stat) => {
            const IconComponent = statIconMap[stat.iconName];
            return (
              <div
                key={stat.id}
                className="flex items-center gap-3.5 sm:gap-4 p-3 rounded-2xl transition-all hover:bg-card/50"
              >
                <div className="size-12 sm:size-14 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center shrink-0 border border-primary/20 shadow-xs">
                  <IconComponent className="size-6 sm:size-7" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-none">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
