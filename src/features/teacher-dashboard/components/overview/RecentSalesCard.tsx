import { use } from "react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentSale } from "../../types";

type RecentSalesCardProps = {
    salesPromise: Promise<RecentSale[]>;
};

// The last paid sales of the teacher's courses
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
                        const buyerName =
                            `${sale.order.buyer?.first_name ?? ""} ${sale.order.buyer?.last_name ?? ""}`.trim() ||
                            "A student";

                        return (
                            // unique: one course in one order
                            <li
                                key={`${sale.order_id}-${sale.course_id}`}
                                className="flex items-center gap-3 border-t border-border py-2.5"
                            >
                                <span className="h-8 w-1 rounded-full bg-emerald-400" />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">{buyerName}</p>
                                    <p className="truncate text-xs text-muted-foreground">{sale.course.title}</p>
                                </div>
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                    +${sale.price.toFixed(2)}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </CardContent>
        </Card>
    );
}
