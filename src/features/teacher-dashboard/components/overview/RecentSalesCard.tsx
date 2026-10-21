import { use } from "react";
import { ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RecentSale } from "../../types";

type RecentSalesCardProps = {
    salesPromise: Promise<RecentSale[]>;
};

// The last sales (green) and refunds (red)
export function RecentSalesCard({ salesPromise }: RecentSalesCardProps) {
    const sales = use(salesPromise); // waits inside the <Suspense> of TeacherOverview

    return (
        <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader>
                <CardTitle className="font-bold">Recent sales</CardTitle>
                <CardAction>
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                </CardAction>
            </CardHeader>

            <CardContent>
                {/* a new teacher: no sales yet */}
                {sales.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">No sales yet</p>}

                <ul>
                    {sales.map((sale) => {
                        const isRefund = sale.amount < 0;
                        return (
                            <li key={sale.id} className="flex items-center gap-3 border-t border-border py-2.5">
                                <span className={cn("h-8 w-1 rounded-full", isRefund ? "bg-rose-400" : "bg-emerald-400")} />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        {isRefund ? `Refund · ${sale.studentName}` : sale.studentName}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">{sale.courseTitle}</p>
                                </div>
                                <span
                                    className={cn(
                                        "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                        isRefund
                                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
                                    )}
                                >
                                    {isRefund ? "-" : "+"}${Math.abs(sale.amount).toFixed(2)}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </CardContent>
        </Card>
    );
}

export function RecentSalesCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-3">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                        <Skeleton className="h-8 w-1" />
                        <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3 w-3/4" />
                            <Skeleton className="h-2.5 w-1/2" />
                        </div>
                        <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
