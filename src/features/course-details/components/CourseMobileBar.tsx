import { Button } from "@/components/ui/button";
import { formatPrice } from "@/features/courses/utils/format";

type CourseMobileBarProps = {
  price: number;
  currency: string;
};

// Small screens: price + Enroll always visible at the bottom (UI only for now)
export function CourseMobileBar({ price, currency }: CourseMobileBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <p className="text-xl font-black text-foreground">{formatPrice(price, currency)}</p>
        <Button size="lg" rounded="xl" className="h-11 flex-1 font-semibold sm:flex-none sm:px-10">
          {price === 0 ? "Enroll for free" : "Enroll now"}
        </Button>
      </div>
    </div>
  );
}
