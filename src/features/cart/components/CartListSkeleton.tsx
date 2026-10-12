import { Skeleton } from "@/components/ui/skeleton"

// Loading state of the cart page: rows on the left, summary on the right
export function CartListSkeleton() {
    return (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
            <div className="space-y-5 rounded-2xl border border-border p-5 sm:p-6">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="flex gap-4">
                        <Skeleton className="aspect-16/10 w-28 shrink-0 rounded-lg sm:w-40" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/3" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                    </div>
                ))}
            </div>
            <Skeleton className="h-72 rounded-2xl" />
        </div>
    )
}
